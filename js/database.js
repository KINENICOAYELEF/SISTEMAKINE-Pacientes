// Funciones para gestionar la base de datos (Firestore)
const dbFunctions = {
    // Referencias a colecciones principales
    collections: {
        pacientes: firebase.firestore().collection('pacientes'),
        evoluciones: firebase.firestore().collection('evoluciones'),
        diagnosticos: firebase.firestore().collection('diagnosticos'),
        tratamientos: firebase.firestore().collection('tratamientos'),
        citas: firebase.firestore().collection('citas'),
        usuarios: firebase.firestore().collection('usuarios')
    },
    
    // FUNCIONES PARA PACIENTES
    
    // Obtener todos los pacientes
    getAllPacientes: function() {
        return this.collections.pacientes
            .orderBy('nombre', 'asc')
            .get()
            .then(snapshot => {
                let pacientes = [];
                
                snapshot.forEach(doc => {
                    pacientes.push({
                        id: doc.id,
                        ...doc.data()
                    });
                });
                
                return pacientes;
            });
    },
    
    // Obtener paciente por ID
    getPacienteById: function(id) {
        return this.collections.pacientes
            .doc(id)
            .get()
            .then(doc => {
                if (doc.exists) {
                    return {
                        id: doc.id,
                        ...doc.data()
                    };
                } else {
                    throw new Error('Paciente no encontrado');
                }
            });
    },
    
    // Buscar pacientes por nombre o RUT
    searchPacientes: function(query) {
        query = query.toLowerCase();
        
        return this.getAllPacientes()
            .then(pacientes => {
                return pacientes.filter(p => 
                    p.nombre.toLowerCase().includes(query) || 
                    (p.rut && p.rut.toLowerCase().includes(query))
                );
            });
    },
    
    // Crear nuevo paciente
    createPaciente: function(data) {
        // Agregar campos de metadatos
        const pacienteData = {
            ...data,
            fechaCreacion: firebase.firestore.FieldValue.serverTimestamp(),
            fechaActualizacion: firebase.firestore.FieldValue.serverTimestamp(),
            estado: 'Activo',
            creadorId: firebase.auth().currentUser.uid,
            creadorNombre: firebase.auth().currentUser.displayName || firebase.auth().currentUser.email
        };
        
        return this.collections.pacientes.add(pacienteData)
            .then(docRef => {
                return {
                    id: docRef.id,
                    ...pacienteData
                };
            });
    },
    
    // Actualizar paciente existente
    updatePaciente: function(id, data) {
        // Agregar campo de fecha de actualización
        const updateData = {
            ...data,
            fechaActualizacion: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        return this.collections.pacientes
            .doc(id)
            .update(updateData)
            .then(() => {
                return {
                    id,
                    ...updateData
                };
            });
    },
    
    // Cambiar estado del paciente (activo/inactivo)
    cambiarEstadoPaciente: function(id, estado) {
        return this.collections.pacientes
            .doc(id)
            .update({
                estado: estado,
                fechaActualizacion: firebase.firestore.FieldValue.serverTimestamp()
            });
    },
    
    // Eliminar paciente (no recomendado, mejor cambiar estado)
    deletePaciente: function(id) {
        return this.collections.pacientes
            .doc(id)
            .delete();
    },
    
    // FUNCIONES PARA EVOLUCIONES
    
    // Obtener todas las evoluciones de un paciente
    getEvolucionesByPaciente: function(pacienteId) {
        return this.collections.evoluciones
            .where('pacienteId', '==', pacienteId)
            .orderBy('fecha', 'desc')
            .get()
            .then(snapshot => {
                let evoluciones = [];
                
                snapshot.forEach(doc => {
                    evoluciones.push({
                        id: doc.id,
                        ...doc.data()
                    });
                });
                
                return evoluciones;
            });
    },
    
    // Crear nueva evolución
    createEvolucion: function(data) {
        // Agregar campos de metadatos
        const evolucionData = {
            ...data,
            fecha: data.fecha || firebase.firestore.FieldValue.serverTimestamp(),
            profesionalId: firebase.auth().currentUser.uid,
            profesionalNombre: firebase.auth().currentUser.displayName || firebase.auth().currentUser.email
        };
        
        // Crear la evolución
        return this.collections.evoluciones.add(evolucionData)
            .then(docRef => {
                // Actualizar la fecha de última visita del paciente
                this.collections.pacientes.doc(data.pacienteId).update({
                    ultimaVisita: firebase.firestore.FieldValue.serverTimestamp(),
                    fechaActualizacion: firebase.firestore.FieldValue.serverTimestamp()
                });
                
                return {
                    id: docRef.id,
                    ...evolucionData
                };
            });
    },
    
    // Obtener evolución por ID
    getEvolucionById: function(id) {
        return this.collections.evoluciones
            .doc(id)
            .get()
            .then(doc => {
                if (doc.exists) {
                    return {
                        id: doc.id,
                        ...doc.data()
                    };
                } else {
                    throw new Error('Evolución no encontrada');
                }
            });
    },
    
    // Actualizar evolución
    updateEvolucion: function(id, data) {
        return this.collections.evoluciones
            .doc(id)
            .update(data)
            .then(() => {
                return {
                    id,
                    ...data
                };
            });
    },
    
    // Eliminar evolución
    deleteEvolucion: function(id) {
        return this.collections.evoluciones
            .doc(id)
            .delete();
    },
    
    // FUNCIONES PARA DIAGNÓSTICOS
    
    // Obtener diagnóstico actual del paciente
    getDiagnosticoActual: function(pacienteId) {
        return this.collections.diagnosticos
            .where('pacienteId', '==', pacienteId)
            .orderBy('fecha', 'desc')
            .limit(1)
            .get()
            .then(snapshot => {
                if (!snapshot.empty) {
                    const doc = snapshot.docs[0];
                    return {
                        id: doc.id,
                        ...doc.data()
                    };
                } else {
                    return null; // No hay diagnóstico
                }
            });
    },
    
    // Obtener todos los diagnósticos de un paciente
    getDiagnosticosByPaciente: function(pacienteId) {
        return this.collections.diagnosticos
            .where('pacienteId', '==', pacienteId)
            .orderBy('fecha', 'desc')
            .get()
            .then(snapshot => {
                let diagnosticos = [];
                
                snapshot.forEach(doc => {
                    diagnosticos.push({
                        id: doc.id,
                        ...doc.data()
                    });
                });
                
                return diagnosticos;
            });
    },
    
    // Crear nuevo diagnóstico
    createDiagnostico: function(data) {
        // Agregar campos de metadatos
        const diagnosticoData = {
            ...data,
            fecha: data.fecha || firebase.firestore.FieldValue.serverTimestamp(),
            profesionalId: firebase.auth().currentUser.uid,
            profesionalNombre: firebase.auth().currentUser.displayName || firebase.auth().currentUser.email
        };
        
        // Crear el diagnóstico
        return this.collections.diagnosticos.add(diagnosticoData)
            .then(docRef => {
                // Actualizar el diagnóstico en el paciente
                this.collections.pacientes.doc(data.pacienteId).update({
                    diagnostico: data.diagnostico,
                    fechaActualizacion: firebase.firestore.FieldValue.serverTimestamp()
                });
                
                return {
                    id: docRef.id,
                    ...diagnosticoData
                };
            });
    },
    
    // FUNCIONES PARA TRATAMIENTOS
    
    // Obtener tratamiento actual del paciente
    getTratamientoActual: function(pacienteId) {
        return this.collections.tratamientos
            .where('pacienteId', '==', pacienteId)
            .orderBy('fecha', 'desc')
            .limit(1)
            .get()
            .then(snapshot => {
                if (!snapshot.empty) {
                    const doc = snapshot.docs[0];
                    return {
                        id: doc.id,
                        ...doc.data()
                    };
                } else {
                    return null; // No hay tratamiento
                }
            });
    },
    
    // Crear nuevo tratamiento
    createTratamiento: function(data) {
        // Agregar campos de metadatos
        const tratamientoData = {
            ...data,
            fecha: data.fecha || firebase.firestore.FieldValue.serverTimestamp(),
            profesionalId: firebase.auth().currentUser.uid,
            profesionalNombre: firebase.auth().currentUser.displayName || firebase.auth().currentUser.email
        };
        
        // Crear el tratamiento
        return this.collections.tratamientos.add(tratamientoData);
    },
    
    // FUNCIONES PARA CITAS
    
    // Obtener citas futuras de un paciente
    getCitasFuturasByPaciente: function(pacienteId) {
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        
        return this.collections.citas
            .where('pacienteId', '==', pacienteId)
            .where('fecha', '>=', hoy)
            .orderBy('fecha', 'asc')
            .get()
            .then(snapshot => {
                let citas = [];
                
                snapshot.forEach(doc => {
                    citas.push({
                        id: doc.id,
                        ...doc.data()
                    });
                });
                
                return citas;
            });
    },
    
    // Crear nueva cita
    createCita: function(data) {
        // Agregar campos de metadatos
        const citaData = {
            ...data,
            creadorId: firebase.auth().currentUser.uid,
            creadorNombre: firebase.auth().currentUser.displayName || firebase.auth().currentUser.email,
            estado: 'Programada',
            fechaCreacion: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        return this.collections.citas.add(citaData);
    },
    
    // Cancelar cita
    cancelarCita: function(id, motivo) {
        return this.collections.citas
            .doc(id)
            .update({
                estado: 'Cancelada',
                motivoCancelacion: motivo || '',
                fechaCancelacion: firebase.firestore.FieldValue.serverTimestamp()
            });
    },
    
    // UTILIDADES
    
    // Convertir timestamp a objeto Date
    timestampToDate: function(timestamp) {
        if (!timestamp) return null;
        
        if (timestamp.toDate) {
            return timestamp.toDate();
        }
        
        return new Date(timestamp);
    },
    
    // Calcular edad a partir de fecha de nacimiento
    calcularEdad: function(fechaNacimiento) {
        if (!fechaNacimiento) return null;
        
        const hoy = new Date();
        const nacimiento = this.timestampToDate(fechaNacimiento);
        
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const m = hoy.getMonth() - nacimiento.getMonth();
        
        if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
            edad--;
        }
        
        return edad;
    }
};

// Exportar funciones para uso en otros archivos
window.dbFunctions = dbFunctions;
