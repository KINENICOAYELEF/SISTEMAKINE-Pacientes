// Funciones para gestionar las evoluciones de pacientes

// Objeto global para funciones de evolución
const evolucionFunctions = {
    // Obtener todas las evoluciones de un paciente
    getEvolucionesByPaciente: function(pacienteId) {
        return firebase.firestore().collection('evoluciones')
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
    
    // Obtener evolución por ID
    getEvolucionById: function(evolucionId) {
        return firebase.firestore().collection('evoluciones')
            .doc(evolucionId)
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
    
    // Obtener la última evolución de un paciente
    getUltimaEvolucion: function(pacienteId) {
        return firebase.firestore().collection('evoluciones')
            .where('pacienteId', '==', pacienteId)
            .orderBy('fecha', 'desc')
            .limit(1)
            .get()
            .then(snapshot => {
                if (snapshot.empty) {
                    return null;
                }
                
                const doc = snapshot.docs[0];
                return {
                    id: doc.id,
                    ...doc.data()
                };
            });
    },
    
    // Crear nueva evolución
    createEvolucion: function(evolucionData) {
        // Agregar campos de metadatos
        const data = {
            ...evolucionData,
            fechaCreacion: firebase.firestore.FieldValue.serverTimestamp(),
            fechaActualizacion: firebase.firestore.FieldValue.serverTimestamp(),
            profesionalId: firebase.auth().currentUser.uid,
            profesionalNombre: firebase.auth().currentUser.displayName || firebase.auth().currentUser.email
        };
        
        // Crear evolución
        return firebase.firestore().collection('evoluciones')
            .add(data)
            .then(docRef => {
                // Actualizar fecha de última visita del paciente
                if (data.estado !== 'Borrador') {
                    return firebase.firestore().collection('pacientes')
                        .doc(data.pacienteId)
                        .update({
                            ultimaVisita: firebase.firestore.FieldValue.serverTimestamp(),
                            fechaActualizacion: firebase.firestore.FieldValue.serverTimestamp()
                        })
                        .then(() => {
                            return {
                                id: docRef.id,
                                ...data
                            };
                        });
                }
                
                return {
                    id: docRef.id,
                    ...data
                };
            });
    },
    
    // Actualizar evolución existente
    updateEvolucion: function(evolucionId, evolucionData) {
        // Agregar campos de metadatos
        const data = {
            ...evolucionData,
            fechaActualizacion: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        // Actualizar evolución
        return firebase.firestore().collection('evoluciones')
            .doc(evolucionId)
            .update(data)
            .then(() => {
                // Actualizar fecha de última visita del paciente
                if (data.estado !== 'Borrador' && data.pacienteId) {
                    return firebase.firestore().collection('pacientes')
                        .doc(data.pacienteId)
                        .update({
                            fechaActualizacion: firebase.firestore.FieldValue.serverTimestamp()
                        })
                        .then(() => {
                            return {
                                id: evolucionId,
                                ...data
                            };
                        });
                }
                
                return {
                    id: evolucionId,
                    ...data
                };
            });
    },
    
    // Eliminar evolución
    deleteEvolucion: function(evolucionId) {
        return firebase.firestore().collection('evoluciones')
            .doc(evolucionId)
            .delete();
    },
    
    // Obtener el próximo número de sesión para un paciente
    getProximoNumeroSesion: function(pacienteId) {
        return firebase.firestore().collection('evoluciones')
            .where('pacienteId', '==', pacienteId)
            .orderBy('numeroSesion', 'desc')
            .limit(1)
            .get()
            .then(snapshot => {
                if (snapshot.empty) {
                    return 1; // Primera sesión
                }
                
                const ultimaSesion = snapshot.docs[0].data().numeroSesion || 0;
                return ultimaSesion + 1;
            });
    },
    
    // Obtener resumen de evoluciones para dashboard
    getResumenEvoluciones: function(pacienteId, limit = 5) {
        return firebase.firestore().collection('evoluciones')
            .where('pacienteId', '==', pacienteId)
            .orderBy('fecha', 'desc')
            .limit(limit)
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
    
    // Generar gráfico de evolución del dolor
    generarGraficoEvolucionDolor: function(pacienteId, elementId) {
        return this.getEvolucionesByPaciente(pacienteId)
            .then(evoluciones => {
                if (evoluciones.length === 0) {
                    document.getElementById(elementId).innerHTML = '<div class="alert alert-info">No hay suficientes datos para generar el gráfico</div>';
                    return;
                }
                
                // Ordenar evoluciones por fecha (de más antigua a más reciente)
                evoluciones.sort((a, b) => {
                    if (!a.fecha || !b.fecha) return 0;
                    return a.fecha.seconds - b.fecha.seconds;
                });
                
                // Preparar datos para el gráfico
                const labels = evoluciones.map(e => {
                    if (e.fecha) {
                        const fecha = new Date(e.fecha.seconds * 1000);
                        return fecha.toLocaleDateString();
                    }
                    return `Sesión ${e.numeroSesion || '?'}`;
                });
                
                const dolorInicial = evoluciones.map(e => e.intensidadDolorInicial || 0);
                const dolorFinal = evoluciones.map(e => e.intensidadDolorFinal || 0);
                
                // Crear gráfico con Chart.js
                const ctx = document.getElementById(elementId).getContext('2d');
                
                new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [
                            {
                                label: 'Dolor Inicial',
                                data: dolorInicial,
                                borderColor: 'rgba(234, 67, 53, 1)',
                                backgroundColor: 'rgba(234, 67, 53, 0.1)',
                                borderWidth: 2,
                                tension: 0.2
                            },
                            {
                                label: 'Dolor Final',
                                data: dolorFinal,
                                borderColor: 'rgba(66, 133, 244, 1)',
                                backgroundColor: 'rgba(66, 133, 244, 0.1)',
                                borderWidth: 2,
                                tension: 0.2
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        scales: {
                            y: {
                                beginAtZero: true,
                                max: 10,
                                title: {
                                    display: true,
                                    text: 'Intensidad del Dolor (EVA 0-10)'
                                }
                            },
                            x: {
                                title: {
                                    display: true,
                                    text: 'Sesiones'
                                }
                            }
                        },
                        plugins: {
                            title: {
                                display: true,
                                text: 'Evolución del Dolor a lo Largo del Tratamiento'
                            },
                            tooltip: {
                                callbacks: {
                                    afterLabel: function(context) {
                                        const index = context.dataIndex;
                                        const evolucion = evoluciones[index];
                                        return [
                                            `Sesión #${evolucion.numeroSesion || '?'}`,
                                            `Tipo: ${evolucion.tipoSesion || 'No especificado'}`,
                                            `Descripción: ${window.utils.truncarTexto(evolucion.descripcion || '', 50)}`
                                        ];
                                    }
                                }
                            }
                        }
                    }
                });
            })
            .catch(error => {
                console.error('Error al generar gráfico de evolución:', error);
                document.getElementById(elementId).innerHTML = '<div class="alert alert-danger">Error al generar el gráfico</div>';
            });
    },
    
    // Generar informe de evolución para imprimir o PDF
    generarInformeEvolucion: function(evolucionId) {
        return this.getEvolucionById(evolucionId)
            .then(evolucion => {
                // Obtener datos del paciente
                return firebase.firestore().collection('pacientes')
                    .doc(evolucion.pacienteId)
                    .get()
                    .then(doc => {
                        if (!doc.exists) {
                            throw new Error('Paciente no encontrado');
                        }
                        
                        const paciente = doc.data();
                        
                        // Generar HTML del informe
                        const html = `
                            <div class="container">
                                <div class="row mb-4">
                                    <div class="col-12 text-center">
                                        <h2>Informe de Evolución Kinesiológica</h2>
                                        <h4>SISTEMAKINE</h4>
                                    </div>
                                </div>
                                
                                <div class="row mb-4">
                                    <div class="col-12">
                                        <div class="card">
                                            <div class="card-header bg-primary text-white">
                                                <h5 class="mb-0">Datos del Paciente</h5>
                                            </div>
                                            <div class="card-body">
                                                <div class="row">
                                                    <div class="col-md-6">
                                                        <p><strong>Nombre:</strong> ${paciente.nombre || 'No registrado'}</p>
                                                        <p><strong>RUT:</strong> ${paciente.rut || 'No registrado'}</p>
                                                        <p><strong>Edad:</strong> ${paciente.edad || window.utils.calcularEdad(paciente.fechaNacimiento) || 'No registrada'} años</p>
                                                    </div>
                                                    <div class="col-md-6">
                                                        <p><strong>Diagnóstico:</strong> ${paciente.diagnostico || paciente.motivoConsulta?.diagnosticoMedico || 'No registrado'}</p>
                                                        <p><strong>Fecha Inicio Tratamiento:</strong> ${paciente.fechaCreacion ? window.utils.formatearFecha(paciente.fechaCreacion) : 'No registrada'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="row mb-4">
                                    <div class="col-12">
                                        <div class="card">
                                            <div class="card-header bg-primary text-white">
                                                <h5 class="mb-0">Datos de la Sesión</h5>
                                            </div>
                                            <div class="card-body">
                                                <div class="row">
                                                    <div class="col-md-6">
                                                        <p><strong>Fecha:</strong> ${evolucion.fecha ? window.utils.formatearFecha(evolucion.fecha) : 'No registrada'}</p>
                                                        <p><strong>Hora:</strong> ${evolucion.hora || 'No registrada'}</p>
                                                        <p><strong>Número de Sesión:</strong> ${evolucion.numeroSesion || 'No registrado'}</p>
                                                        <p><strong>Tipo de Sesión:</strong> ${evolucion.tipoSesion || 'No registrado'}</p>
                                                    </div>
                                                    <div class="col-md-6">
                                                        <p><strong>Kinesiólogo:</strong> ${evolucion.profesionalNombre || 'No registrado'}</p>
                                                        <p><strong>Respuesta al Tratamiento:</strong> ${evolucion.respuestaTratamiento || 'No registrada'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="row mb-4">
                                    <div class="col-12">
                                        <div class="card">
                                            <div class="card-header bg-primary text-white">
                                                <h5 class="mb-0">Evaluación de Dolor</h5>
                                            </div>
                                            <div class="card-body">
                                                <div class="row">
                                                    <div class="col-md-6">
                                                        <p><strong>Intensidad Inicial (EVA 0-10):</strong> ${evolucion.intensidadDolorInicial || '0'}</p>
                                                    </div>
                                                    <div class="col-md-6">
                                                        <p><strong>Intensidad Final (EVA 0-10):</strong> ${evolucion.intensidadDolorFinal || '0'}</p>
                                                    </div>
                                                    <div class="col-md-12">
                                                        <p><strong>Ubicación del Dolor:</strong> ${evolucion.ubicacionDolor || 'No registrada'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="row mb-4">
                                    <div class="col-12">
                                        <div class="card">
                                            <div class="card-header bg-primary text-white">
                                                <h5 class="mb-0">Procedimientos Realizados</h5>
                                            </div>
                                            <div class="card-body">
                                                <p><strong>Procedimientos:</strong> ${evolucion.procedimientos ? evolucion.procedimientos.join(', ') : 'No registrados'}</p>
                                                <p><strong>Detalles:</strong> ${evolucion.detallesProcedimientos || 'No registrados'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="row mb-4">
                                    <div class="col-12">
                                        <div class="card">
                                            <div class="card-header bg-primary text-white">
                                                <h5 class="mb-0">Evolución y Observaciones</h5>
                                            </div>
                                            <div class="card-body">
                                                <p><strong>Descripción de la Evolución:</strong></p>
                                                <p>${evolucion.descripcion || 'No registrada'}</p>
                                                
                                                <p><strong>Observaciones Adicionales:</strong></p>
                                                <p>${evolucion.observaciones || 'No registradas'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="row mb-4">
                                    <div class="col-12">
                                        <div class="card">
                                            <div class="card-header bg-primary text-white">
                                                <h5 class="mb-0">Plan para Próxima Sesión</h5>
                                            </div>
                                            <div class="card-body">
                                                <p><strong>Plan Propuesto:</strong></p>
                                                <p>${evolucion.planProximaSesion || 'No registrado'}</p>
                                                
                                                <p><strong>Fecha Próxima Sesión:</strong> ${evolucion.fechaProximaSesion ? window.utils.formatearFecha(evolucion.fechaProximaSesion) : 'No registrada'}</p>
                                                
                                                <p><strong>Recomendaciones para el Paciente:</strong></p>
                                                <p>${evolucion.recomendacionesPaciente || 'No registradas'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="row mt-5">
                                    <div class="col-12 text-center">
                                        <p>__________________________________</p>
                                        <p>${evolucion.profesionalNombre || 'Profesional'}</p>
                                        <p>Kinesiólogo</p>
                                    </div>
                                </div>
                            </div>
                        `;
                        
                        return html;
                    });
            });
    }
};

// Exportar funciones para uso en otras páginas
window.evolucionFunctions = evolucionFunctions;

// Inicialización al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    // Sliders de dolor
    const sliderDolorInicial = document.getElementById('intensidadDolorInicial');
    const valorEvaInicial = document.getElementById('valorEvaInicial');
    const sliderDolorFinal = document.getElementById('intensidadDolorFinal');
    const valorEvaFinal = document.getElementById('valorEvaFinal');
    
    if (sliderDolorInicial && valorEvaInicial) {
        sliderDolorInicial.addEventListener('input', function() {
            valorEvaInicial.textContent = this.value;
        });
    }
    
    if (sliderDolorFinal && valorEvaFinal) {
        sliderDolorFinal.addEventListener('input', function() {
            valorEvaFinal.textContent = this.value;
        });
    }
    
    // Cargar número de sesión automáticamente
    const numeroSesion = document.getElementById('numeroSesion');
    const pacienteId = new URLSearchParams(window.location.search).get('id');
    
    if (numeroSesion && pacienteId) {
        evolucionFunctions.getProximoNumeroSesion(pacienteId)
            .then(function(numero) {
                numeroSesion.value = numero;
            })
            .catch(function(error) {
                console.error('Error al obtener próximo número de sesión:', error);
                numeroSesion.value = 1;
            });
    }
});
