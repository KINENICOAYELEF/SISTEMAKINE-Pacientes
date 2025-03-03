// Script para manejar funcionalidades de pacientes

document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticación
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // Usuario autenticado
            document.getElementById('nombreUsuario').textContent = user.displayName || user.email;
            
            // Inicializar funcionalidades específicas según la página
            if (document.getElementById('formNuevoPaciente')) {
                initNuevoPaciente();
            }
            
            if (document.querySelector('.lista-pacientes')) {
                cargarListaPacientes();
            }
            
            if (document.getElementById('detallePaciente')) {
                const urlParams = new URLSearchParams(window.location.search);
                const pacienteId = urlParams.get('id');
                
                if (pacienteId) {
                    cargarDetallePaciente(pacienteId);
                } else {
                    alert('ID de paciente no especificado');
                    window.location.href = 'listado-pacientes.html';
                }
            }
        } else {
            // No hay usuario autenticado, redirigir al login
            window.location.href = 'login.html';
        }
    });
    
    // Manejar cierre de sesión
    const btnCerrarSesion = document.getElementById('btnCerrarSesion');
    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener('click', function(e) {
            e.preventDefault();
            cerrarSesion();
        });
    }
    
    const linkCerrarSesion = document.getElementById('linkCerrarSesion');
    if (linkCerrarSesion) {
        linkCerrarSesion.addEventListener('click', function(e) {
            e.preventDefault();
            cerrarSesion();
        });
    }
});

// Función para cerrar sesión
function cerrarSesion() {
    firebase.auth().signOut().then(function() {
        window.location.href = 'login.html';
    }).catch(function(error) {
        console.error('Error al cerrar sesión:', error);
        alert('Error al cerrar sesión. Intente nuevamente.');
    });
}

// Inicializar formulario de nuevo paciente
function initNuevoPaciente() {
    // Calcular edad automáticamente al cambiar fecha de nacimiento
    const fechaNacimiento = document.getElementById('fechaNacimiento');
    if (fechaNacimiento) {
        fechaNacimiento.addEventListener('change', function() {
            calcularEdad();
        });
    }
    
    // Manejar sliders EVA
    const sliderIntensidad = document.getElementById('aliciaIntensidad');
    if (sliderIntensidad) {
        sliderIntensidad.addEventListener('input', function() {
            document.getElementById('valorEvaAlicia').textContent = this.value;
        });
    }
    
    // Manejar modal de medicamentos
    const btnAgregarMedicamento = document.getElementById('btnAgregarMedicamento');
    if (btnAgregarMedicamento) {
        btnAgregarMedicamento.addEventListener('click', function() {
            new bootstrap.Modal(document.getElementById('modalMedicamento')).show();
        });
    }
    
    const btnGuardarMedicamento = document.getElementById('btnGuardarMedicamento');
    if (btnGuardarMedicamento) {
        btnGuardarMedicamento.addEventListener('click', function() {
            agregarMedicamento();
        });
    }
    
    // Manejar envío del formulario
    const formNuevoPaciente = document.getElementById('formNuevoPaciente');
    if (formNuevoPaciente) {
        formNuevoPaciente.addEventListener('submit', function(e) {
            e.preventDefault();
            guardarPaciente();
        });
    }
}

// Calcular edad a partir de la fecha de nacimiento
function calcularEdad() {
    const fechaNacimiento = document.getElementById('fechaNacimiento').value;
    
    if (fechaNacimiento) {
        const fechaNac = new Date(fechaNacimiento);
        const hoy = new Date();
        
        let edad = hoy.getFullYear() - fechaNac.getFullYear();
        const mes = hoy.getMonth() - fechaNac.getMonth();
        
        if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
            edad--;
        }
        
        document.getElementById('edad').value = edad;
    } else {
        document.getElementById('edad').value = '';
    }
}

// Agregar medicamento a la tabla
function agregarMedicamento() {
    const nombreMedicamento = document.getElementById('nombreMedicamento').value;
    const dosisMedicamento = document.getElementById('dosisMedicamento').value;
    const frecuenciaMedicamento = document.getElementById('frecuenciaMedicamento').value;
    const propositoMedicamento = document.getElementById('propositoMedicamento').value;
    
    if (!nombreMedicamento || !dosisMedicamento || !frecuenciaMedicamento) {
        alert('Por favor, complete los campos obligatorios');
        return;
    }
    
    const tablaMedicamentos = document.getElementById('tablaMedicamentos');
    const tbody = tablaMedicamentos.querySelector('tbody');
    
    // Limpiar mensaje de "No hay medicamentos"
    if (tbody.querySelector('td[colspan="5"]')) {
        tbody.innerHTML = '';
    }
    
    // Crear fila de medicamento
    const fila = document.createElement('tr');
    fila.setAttribute('data-medicamento', JSON.stringify({
        nombre: nombreMedicamento,
        dosis: dosisMedicamento,
        frecuencia: frecuenciaMedicamento,
        proposito: propositoMedicamento
    }));
    
    fila.innerHTML = `
        <td>${nombreMedicamento}</td>
        <td>${dosisMedicamento}</td>
        <td>${frecuenciaMedicamento}</td>
        <td>${propositoMedicamento || '-'}</td>
        <td>
            <button type="button" class="btn btn-sm btn-danger btn-eliminar-medicamento">
                <i class="fas fa-trash-alt"></i>
            </button>
        </td>
    `;
    
    tbody.appendChild(fila);
    
    // Agregar evento para eliminar medicamento
    fila.querySelector('.btn-eliminar-medicamento').addEventListener('click', function() {
        fila.remove();
        
        // Si no hay más medicamentos, mostrar mensaje
        if (tbody.querySelectorAll('tr').length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center">No hay medicamentos registrados</td></tr>';
        }
    });
    
    // Cerrar modal y limpiar campos
    document.getElementById('nombreMedicamento').value = '';
    document.getElementById('dosisMedicamento').value = '';
    document.getElementById('frecuenciaMedicamento').value = '';
    document.getElementById('viaMedicamento').value = '';
    document.getElementById('propositoMedicamento').value = '';
    
    bootstrap.Modal.getInstance(document.getElementById('modalMedicamento')).hide();
}

// Obtener datos de checkboxes múltiples
function getCheckboxValues(name) {
    const checkboxes = document.querySelectorAll(`input[name="${name}"]:checked`);
    return Array.from(checkboxes).map(cb => cb.value);
}

// Guardar paciente en Firestore
function guardarPaciente() {
    const alertaGuardado = document.getElementById('alertaGuardado');
    const alertaError = document.getElementById('alertaError');
    const mensajeError = document.getElementById('mensajeError');
    
    // Ocultar alertas previas
    alertaGuardado.classList.add('d-none');
    alertaError.classList.add('d-none');
    
    // Recopilar datos del formulario
    const datosPersonales = {
        nombre: document.getElementById('nombre').value,
        rut: document.getElementById('rut').value,
        fechaNacimiento: document.getElementById('fechaNacimiento').value ? new Date(document.getElementById('fechaNacimiento').value) : null,
        edad: parseInt(document.getElementById('edad').value) || null,
        genero: document.getElementById('genero').value,
        estadoCivil: document.getElementById('estadoCivil').value,
        nacionalidad: document.getElementById('nacionalidad').value,
        
        // Contacto
        direccion: document.getElementById('direccion').value,
        telefonoPersonal: document.getElementById('telefonoPersonal').value,
        telefonoTrabajo: document.getElementById('telefonoTrabajo').value,
        email: document.getElementById('email').value,
        
        // Sociolaborales
        nivelEducacional: document.getElementById('nivelEducacional').value,
        ocupacion: document.getElementById('ocupacion').value,
        tipoTrabajo: document.getElementById('tipoTrabajo').value,
        horarioLaboral: document.getElementById('horarioLaboral').value,
        condicionesErgonomicas: document.getElementById('condicionesErgonomicas').value,
        actividadesRecreativas: document.getElementById('actividadesRecreativas').value,
        nivelActividadFisica: document.getElementById('nivelActividadFisica').value,
        
        // Emergencia
        contactoEmergencia: document.getElementById('contactoEmergencia').value,
        parentesco: document.getElementById('parentesco').value,
        telefonoEmergencia: document.getElementById('telefonoEmergencia').value,
        sistemaSalud: document.getElementById('sistemaSalud').value,
        
        // Lateralidad
        dominanciaManual: document.getElementById('dominanciaManual').value,
        dominanciaPodal: document.getElementById('dominanciaPodal').value
    };
    
    // Motivo de consulta
    const motivoConsulta = {
        profesionalDeriva: document.getElementById('profesionalDeriva').value,
        especialidad: document.getElementById('especialidad').value,
        diagnosticoMedico: document.getElementById('diagnosticoMedico').value,
        motivoConsulta: document.getElementById('motivoConsulta').value,
        fechaDerivacion: document.getElementById('fechaDerivacion').value ? new Date(document.getElementById('fechaDerivacion').value) : null,
        numeroInterconsulta: document.getElementById('numeroInterconsulta').value,
        prioridad: document.getElementById('prioridad').value,
        // SINSS
sinssSeveridad: parseInt(document.getElementById('sinssSeveridad').value) || 0,
sinssImpacto: document.getElementById('sinssImpacto').value,
sinssIrradiacion: document.getElementById('sinssIrradiacion').value,
sinssNaturaleza: getCheckboxValues('sinssNaturaleza'),
sinssSintomas: document.getElementById('sinssSintomas').value,
sinssAgravantes: document.getElementById('sinssAgravantes').value,
sinssAliviantes: document.getElementById('sinssAliviantes').value,
sinssPatron: document.getElementById('sinssPatron').value,
sinssVariacion: document.getElementById('sinssVariacion').value,
sinssDuracion: document.getElementById('sinssDuracion').value,
        
        // Historia de la condición
        inicioSintomas: document.getElementById('inicioSintomas').value ? new Date(document.getElementById('inicioSintomas').value) : null,
        mecanismoLesion: document.getElementById('mecanismoLesion').value,
        detallesMecanismo: document.getElementById('detallesMecanismo').value,
        evolucionSintomas: document.getElementById('evolucionSintomas').value,
        tratamientosPrevios: getCheckboxValues('tratamientosPrevios'),
        detallesTratamientos: document.getElementById('detallesTratamientos').value,
        intervencionesRealizadas: document.getElementById('intervencionesRealizadas').value,
        cambiosDiurnos: document.getElementById('cambiosDiurnos').value,
        
        // ALICIA
        aliciaAntecedentes: document.getElementById('aliciaAntecedentes').value,
        aliciaLocalizacion: document.getElementById('aliciaLocalizacion').value,
        aliciaIntensidad: parseInt(document.getElementById('aliciaIntensidad').value) || 0,
        caracteristicasDolor: getCheckboxValues('caracteristicasDolor'),
        aliciaIrradiacion: document.getElementById('aliciaIrradiacion').value,
        aliciaAtenuantes: document.getElementById('aliciaAtenuantes').value,
        aliciaAgravantes: document.getElementById('aliciaAgravantes').value,
        
        // Expectativas
        objetivosCorto: document.getElementById('objetivosCorto').value,
        objetivosMedio: document.getElementById('objetivosMedio').value,
        objetivosLargo: document.getElementById('objetivosLargo').value,
        expectativasRecuperacion: document.getElementById('expectativasRecuperacion').value,
        nivelCompromiso: document.getElementById('nivelCompromiso').value
    };
    
    // Historia médica
    const historiaMedica = {
        enfermedadesCronicas: getCheckboxValues('enfermedadesCronicas'),
        enfermedadesAgudas: document.getElementById('enfermedadesAgudas').value,
        hospitalizaciones: document.getElementById('hospitalizaciones').value,
        cirugiasPrevias: document.getElementById('cirugiasPrevias').value,
        antecedentesOrtopedicos: document.getElementById('antecedentesOrtopedicos').value,
        traumatismosPrevios: document.getElementById('traumatismosPrevios').value,
        facturesPrevia: document.getElementById('fracturasPrevias').value,
        factoresRiesgoCardiovascular: getCheckboxValues('factoresRiesgoCardiovascular'),
        
        // Antecedentes familiares
        enfermedadesHereditarias: document.getElementById('enfermedadesHereditarias').value,
        condicionesGeneticas: document.getElementById('condicionesGeneticas').value,
        antecedentesMusculoesqueleticos: document.getElementById('antecedentesMusculoesqueleticos').value,
        antecedentesAutoinmunes: document.getElementById('antecedentesAutoinmunes').value,
        
        // Medicación
        medicamentos: obtenerMedicamentos(),
        adherenciaTratamiento: document.getElementById('adherenciaTratamiento').value,
        efectosSecundarios: document.getElementById('efectosSecundarios').value,
        
        // Alergias
        alergiasMedicamentos: document.getElementById('alergiasMedicamentos').value,
        alergiasAlimentos: document.getElementById('alergiasAlimentos').value,
        alergiasAmbientales: document.getElementById('alergiasAmbientales').value,
        reaccionesPrevias: document.getElementById('reaccionesPrevias').value,
        alergiasKinesio: getCheckboxValues('alergiasKinesio')
    };
    
    // Hábitos
    const habitos = {
        // Nutricionales
        tipoDieta: document.getElementById('tipoDieta').value,
        consumoAgua: document.getElementById('consumoAgua').value,
        suplementos: document.getElementById('suplementos').value,
        restriccionesAlimentarias: document.getElementById('restriccionesAlimentarias').value,
        
        // Tóxicos
        consumoTabaco: document.getElementById('consumoTabaco').value,
        consumoAlcohol: document.getElementById('consumoAlcohol').value,
        consumoDrogas: document.getElementById('consumoDrogas').value,
        
        // Actividad física
        practicaDeportes: document.getElementById('practicaDeportes').value,
        frecuenciaDeporte: document.getElementById('frecuenciaDeporte').value,
        intensidadDeporte: document.getElementById('intensidadDeporte').value,
        duracionDeporte: document.getElementById('duracionDeporte').value ? parseInt(document.getElementById('duracionDeporte').value) : null,
        lesionesDeportivas: document.getElementById('lesionesDeportivas').value,
        
        // Sueño
        horasSueno: document.getElementById('horasSueno').value ? parseInt(document.getElementById('horasSueno').value) : null,
        calidadSueno: document.getElementById('calidadSueno').value,
        problemasSueno: document.getElementById('problemasSueno').value,
        
        // Entorno social
        descripcionHogar: document.getElementById('descripcionHogar').value,
        accesibilidad: getCheckboxValues('accesibilidad'),
        barrerasArquitectonicas: document.getElementById('barrerasArquitectonicas').value,
        redApoyo: document.getElementById('redApoyo').value,
        nivelEstres: document.getElementById('nivelEstres').value
    };
    
    // Consentimiento
    const consentimiento = {
        consentimientoInformado: document.getElementById('consentimientoInformado').checked,
        autorizacionTratamiento: document.getElementById('autorizacionTratamiento').checked,
        politicaPrivacidad: document.getElementById('politicaPrivacidad').checked,
        manejoDatos: document.getElementById('manejoDatos').checked,
        registroFoto: document.getElementById('registroFoto').checked,
        contactoSeguimiento: document.getElementById('contactoSeguimiento').checked,
        riesgosInformados: document.getElementById('riesgosInformados').value,
        alternativasTerapeuticas: document.getElementById('alternativasTerapeuticas').value
    };
    
    // Combinar todos los datos
    const datosPaciente = {
        ...datosPersonales,
        motivoConsulta: motivoConsulta,
        historiaMedica: historiaMedica,
        habitos: habitos,
        consentimiento: consentimiento,
        
        // Campos de metadatos
        estado: 'Activo',
        fechaCreacion: firebase.firestore.FieldValue.serverTimestamp(),
        fechaActualizacion: firebase.firestore.FieldValue.serverTimestamp(),
        creadorId: firebase.auth().currentUser.uid,
        creadorNombre: firebase.auth().currentUser.displayName || firebase.auth().currentUser.email
    };
    
    // Guardar en Firestore
    firebase.firestore().collection('pacientes').add(datosPaciente)
        .then(function(docRef) {
            console.log('Paciente guardado con ID:', docRef.id);
            
            // Mostrar alerta de éxito
            alertaGuardado.classList.remove('d-none');
            
            // Resetear formulario
            document.getElementById('formNuevoPaciente').reset();
            
            // Redirigir después de 2 segundos
            setTimeout(function() {
                window.location.href = `ver-paciente.html?id=${docRef.id}`;
            }, 2000);
        })
        .catch(function(error) {
            console.error('Error al guardar paciente:', error);
            
            // Mostrar alerta de error
            mensajeError.textContent = error.message || 'Error al guardar paciente';
            alertaError.classList.remove('d-none');
        });
}

// Obtener medicamentos de la tabla
function obtenerMedicamentos() {
    const filasMedicamentos = document.querySelectorAll('#tablaMedicamentos tbody tr[data-medicamento]');
    
    return Array.from(filasMedicamentos).map(function(fila) {
        return JSON.parse(fila.getAttribute('data-medicamento'));
    });
}

// Cargar lista de pacientes
function cargarListaPacientes() {
    const tbody = document.querySelector('.lista-pacientes tbody');
    
    // Mostrar indicador de carga
    tbody.innerHTML = '<tr><td colspan="5" class="text-center">Cargando pacientes...</td></tr>';
    
    firebase.firestore().collection('pacientes')
        .orderBy('fechaCreacion', 'desc')
        .get()
        .then(function(snapshot) {
            if (snapshot.empty) {
                tbody.innerHTML = '<tr><td colspan="5" class="text-center">No hay pacientes registrados</td></tr>';
                return;
            }
            
            let html = '';
            
            snapshot.forEach(function(doc) {
                const paciente = doc.data();
                const fechaNacimiento = paciente.fechaNacimiento ? new Date(paciente.fechaNacimiento.seconds * 1000).toLocaleDateString() : 'No registrada';
                const ultimaVisita = paciente.ultimaVisita ? new Date(paciente.ultimaVisita.seconds * 1000).toLocaleDateString() : 'Sin visitas';
                
                let estadoClass = '';
                let estadoIcon = '';
                
                switch(paciente.estado) {
                    case 'Activo':
                        estadoClass = 'text-success';
                        estadoIcon = 'fa-check-circle';
                        break;
                    case 'Inactivo':
                        estadoClass = 'text-danger';
                        estadoIcon = 'fa-times-circle';
                        break;
                    case 'En espera':
                        estadoClass = 'text-warning';
                        estadoIcon = 'fa-clock';
                        break;
                    default:
                        estadoClass = 'text-secondary';
                        estadoIcon = 'fa-question-circle';
                }
                
                html += `
                <tr>
                    <td>
                        <div class="d-flex align-items-center">
                            <span class="avatar me-3">${obtenerIniciales(paciente.nombre)}</span>
                            <div>
                                <h6 class="mb-0">${paciente.nombre}</h6>
                                <small class="text-muted">${paciente.rut || ''}</small>
                            </div>
                        </div>
                    </td>
                    <td>${fechaNacimiento}</td>
                    <td>${paciente.motivoConsulta?.diagnosticoMedico || 'No registrado'}</td>
                    <td>
                        <span class="${estadoClass}">
                            <i class="fas ${estadoIcon} me-1"></i>${paciente.estado}
                        </span>
                    </td>
                    <td>${ultimaVisita}</td>
                    <td>
                        <a href="ver-paciente.html?id=${doc.id}" class="btn btn-sm btn-icon btn-outline-primary" title="Ver">
                            <i class="fas fa-eye"></i>
                        </a>
                        <a href="diagnostico.html?id=${doc.id}" class="btn btn-sm btn-icon btn-outline-success" title="Diagnóstico">
                            <i class="fas fa-stethoscope"></i>
                        </a>
                        <a href="evolucion.html?id=${doc.id}" class="btn btn-sm btn-icon btn-outline-info" title="Evolución">
                            <i class="fas fa-chart-line"></i>
                        </a>
                        <button class="btn btn-sm btn-icon btn-outline-danger btn-eliminar-paciente" data-id="${doc.id}" title="Eliminar">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </td>
                </tr>
                `;
            });
            
            tbody.innerHTML = html;
            
            // Agregar eventos a botones de eliminar
            document.querySelectorAll('.btn-eliminar-paciente').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    const pacienteId = this.getAttribute('data-id');
                    eliminarPaciente(pacienteId);
                });
            });
        })
        .catch(function(error) {
            console.error('Error al cargar pacientes:', error);
            tbody.innerHTML = '<tr><td colspan="5" class="text-center text-danger">Error al cargar pacientes</td></tr>';
        });
}

// Obtener iniciales del nombre
function obtenerIniciales(nombre) {
    if (!nombre) return '?';
    
    return nombre
        .split(' ')
        .map(n => n.charAt(0))
        .join('')
        .toUpperCase()
        .substring(0, 2);
}

// Cargar detalle de un paciente
function cargarDetallePaciente(pacienteId) {
    const contenedorDetalle = document.getElementById('detallePaciente');
    
    if (!contenedorDetalle) return;
    
    // Mostrar indicador de carga
    contenedorDetalle.innerHTML = '<div class="text-center"><div class="spinner-border text-primary" role="status"></div><p class="mt-2">Cargando datos del paciente...</p></div>';
    
    firebase.firestore().collection('pacientes').doc(pacienteId).get()
        .then(function(doc) {
            if (!doc.exists) {
                contenedorDetalle.innerHTML = '<div class="alert alert-danger">Paciente no encontrado</div>';
                return;
            }
            
            const paciente = doc.data();
            
            // Mostrar los datos del paciente en el contenedor
            mostrarDetallePaciente(paciente, pacienteId);
        })
        .catch(function(error) {
            console.error('Error al cargar detalle del paciente:', error);
            contenedorDetalle.innerHTML = '<div class="alert alert-danger">Error al cargar datos del paciente</div>';
        });
}

// Mostrar detalle del paciente en la interfaz
function mostrarDetallePaciente(paciente, pacienteId) {
    // Esta función se implementará en ver-paciente.html
    // para mostrar todos los detalles del paciente
}

// Eliminar paciente (o cambiar estado a inactivo)
function eliminarPaciente(pacienteId) {
    if (confirm('¿Está seguro que desea eliminar este paciente? Esta acción no se puede deshacer.')) {
        // En lugar de eliminar, se recomienda cambiar el estado a "Inactivo"
        firebase.firestore().collection('pacientes').doc(pacienteId).update({
            estado: 'Inactivo',
            fechaActualizacion: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(function() {
            alert('Paciente marcado como inactivo correctamente');
            cargarListaPacientes(); // Recargar la lista
        })
        .catch(function(error) {
            console.error('Error al actualizar paciente:', error);
            alert('Error al actualizar paciente');
        });
    }
}
