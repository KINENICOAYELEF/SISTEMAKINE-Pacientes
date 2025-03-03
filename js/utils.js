// Funciones de utilidad para el sistema

// Formatear fecha para mostrar en la interfaz
function formatearFecha(fecha, incluirHora = false) {
    if (!fecha) return '';
    
    // Si es un timestamp de Firestore
    if (fecha.seconds) {
        fecha = new Date(fecha.seconds * 1000);
    } else if (!(fecha instanceof Date)) {
        // Si es un string, convertirlo a Date
        fecha = new Date(fecha);
    }
    
    // Verificar si la fecha es válida
    if (isNaN(fecha.getTime())) {
        return '';
    }
    
    const opciones = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    
    if (incluirHora) {
        opciones.hour = '2-digit';
        opciones.minute = '2-digit';
    }
    
    return fecha.toLocaleDateString('es-ES', opciones);
}

// Formatear fecha para input type="date"
function formatearFechaInput(fecha) {
    if (!fecha) return '';
    
    // Si es un timestamp de Firestore
    if (fecha.seconds) {
        fecha = new Date(fecha.seconds * 1000);
    } else if (!(fecha instanceof Date)) {
        // Si es un string, convertirlo a Date
        fecha = new Date(fecha);
    }
    
    // Verificar si la fecha es válida
    if (isNaN(fecha.getTime())) {
        return '';
    }
    
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
}

// Calcular edad a partir de fecha de nacimiento
function calcularEdad(fechaNacimiento) {
    if (!fechaNacimiento) return null;
    
    // Si es un timestamp de Firestore
    if (fechaNacimiento.seconds) {
        fechaNacimiento = new Date(fechaNacimiento.seconds * 1000);
    } else if (!(fechaNacimiento instanceof Date)) {
        // Si es un string, convertirlo a Date
        fechaNacimiento = new Date(fechaNacimiento);
    }
    
    // Verificar si la fecha es válida
    if (isNaN(fechaNacimiento.getTime())) {
        return null;
    }
    
    const hoy = new Date();
    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const mes = hoy.getMonth() - fechaNacimiento.getMonth();
    
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
        edad--;
    }
    
    return edad;
}

// Obtener iniciales de un nombre
function obtenerIniciales(nombre) {
    if (!nombre) return '?';
    
    return nombre
        .split(' ')
        .map(n => n.charAt(0))
        .join('')
        .toUpperCase()
        .substring(0, 2);
}

// Truncar texto con puntos suspensivos
function truncarTexto(texto, longitud = 100) {
    if (!texto) return '';
    
    if (texto.length <= longitud) {
        return texto;
    }
    
    return texto.substring(0, longitud) + '...';
}

// Crear enlace para compartir por WhatsApp
function crearEnlaceWhatsApp(telefono, mensaje) {
    // Eliminar caracteres no numéricos del teléfono
    telefono = telefono.replace(/\D/g, '');
    
    // Asegurarse de que el teléfono tenga el formato correcto
    if (!telefono.startsWith('569') && !telefono.startsWith('+569')) {
        if (telefono.startsWith('9')) {
            telefono = '56' + telefono;
        } else {
            telefono = '569' + telefono;
        }
    }
    
    // Codificar el mensaje para URL
    mensaje = encodeURIComponent(mensaje);
    
    return `https://wa.me/${telefono}?text=${mensaje}`;
}

// Crear enlace para enviar email
function crearEnlaceEmail(email, asunto, cuerpo) {
    asunto = encodeURIComponent(asunto || '');
    cuerpo = encodeURIComponent(cuerpo || '');
    
    return `mailto:${email}?subject=${asunto}&body=${cuerpo}`;
}

// Validar RUT chileno
function validarRUT(rut) {
    if (!rut) return false;
    
    // Limpiar el RUT
    rut = rut.replace(/\./g, '').replace(/-/g, '');
    
    // Validar formato
    if (!/^[0-9]{7,8}[0-9k]$/i.test(rut)) {
        return false;
    }
    
    // Obtener dígito verificador
    const dv = rut.slice(-1).toUpperCase();
    const rutSinDV = rut.slice(0, -1);
    
    // Calcular dígito verificador
    let suma = 0;
    let multiplicador = 2;
    
    for (let i = rutSinDV.length - 1; i >= 0; i--) {
        suma += parseInt(rutSinDV.charAt(i)) * multiplicador;
        multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }
    
    const dvCalculado = 11 - (suma % 11);
    let dvEsperado;
    
    if (dvCalculado === 11) {
        dvEsperado = '0';
    } else if (dvCalculado === 10) {
        dvEsperado = 'K';
    } else {
        dvEsperado = dvCalculado.toString();
    }
    
    return dv === dvEsperado;
}

// Formatear RUT con puntos y guión
function formatearRUT(rut) {
    if (!rut) return '';
    
    // Limpiar el RUT
    rut = rut.replace(/\./g, '').replace(/-/g, '');
    
    // Validar formato
    if (!/^[0-9]{7,8}[0-9k]$/i.test(rut)) {
        return rut;
    }
    
    // Separar dígito verificador
    const dv = rut.slice(-1);
    let rutSinDV = rut.slice(0, -1);
    
    // Formatear con puntos
    let rutFormateado = '';
    while (rutSinDV.length > 3) {
        rutFormateado = '.' + rutSinDV.slice(-3) + rutFormateado;
        rutSinDV = rutSinDV.slice(0, -3);
    }
    
    rutFormateado = rutSinDV + rutFormateado;
    
    return rutFormateado + '-' + dv;
}

// Generar color aleatorio basado en un texto
function generarColorDesdeTexto(texto) {
    if (!texto) return '#cccccc';
    
    // Calcular hash simple
    let hash = 0;
    for (let i = 0; i < texto.length; i++) {
        hash = texto.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Convertir a color (evitando colores muy claros)
    let color = '#';
    for (let i = 0; i < 3; i++) {
        let value = (hash >> (i * 8)) & 0xFF;
        // Asegurar que no sea muy claro
        value = Math.max(value, 100);
        color += ('00' + value.toString(16)).substr(-2);
    }
    
    return color;
}

// Copiar texto al portapapeles
function copiarAlPortapapeles(texto) {
    // Crear un elemento temporal
    const elemento = document.createElement('textarea');
    elemento.value = texto;
    elemento.setAttribute('readonly', '');
    elemento.style.position = 'absolute';
    elemento.style.left = '-9999px';
    document.body.appendChild(elemento);
    
    // Seleccionar y copiar
    elemento.select();
    document.execCommand('copy');
    
    // Eliminar el elemento
    document.body.removeChild(elemento);
    
    return true;
}

// Crear CSV a partir de un array de objetos
function crearCSV(datos) {
    if (!datos || !datos.length) {
        return '';
    }
    
    // Obtener encabezados
    const encabezados = Object.keys(datos[0]);
    
    // Crear líneas
    const lineas = [
        // Encabezados
        encabezados.join(','),
        
        // Datos
        ...datos.map(objeto => {
            return encabezados.map(encabezado => {
                const valor = objeto[encabezado];
                
                // Formatear valor según tipo
                if (typeof valor === 'string') {
                    // Escapar comillas dobles y encerrar en comillas
                    return `"${valor.replace(/"/g, '""')}"`;
                } else if (valor instanceof Date) {
                    return `"${formatearFecha(valor)}"`;
                } else if (valor === null || valor === undefined) {
                    return '';
                } else {
                    return valor;
                }
            }).join(',');
        })
    ];
    
    return lineas.join('\n');
}

// Descargar archivo desde string
function descargarArchivo(contenido, nombreArchivo, tipoMIME = 'text/plain') {
    const blob = new Blob([contenido], { type: tipoMIME });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.setAttribute('href', url);
    link.setAttribute('download', nombreArchivo);
    document.body.appendChild(link);
    
    link.click();
    document.body.removeChild(link);
}

// Generar UUID aleatorio
function generarUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Formatear número con separador de miles
function formatearNumero(numero, decimales = 0) {
    if (numero === null || numero === undefined) {
        return '';
    }
    
    return new Intl.NumberFormat('es-CL', {
        minimumFractionDigits: decimales,
        maximumFractionDigits: decimales
    }).format(numero);
}

// Mostrar notificación emergente
function mostrarNotificacion(mensaje, tipo = 'info', duracion = 3000) {
    // Crear contenedor si no existe
    let contenedor = document.getElementById('notificacionesContainer');
    
    if (!contenedor) {
        contenedor = document.createElement('div');
        contenedor.id = 'notificacionesContainer';
        contenedor.style.position = 'fixed';
        contenedor.style.top = '20px';
        contenedor.style.right = '20px';
        contenedor.style.zIndex = '9999';
        document.body.appendChild(contenedor);
    }
    
    // Crear notificación
    const notificacion = document.createElement('div');
    notificacion.className = `alert alert-${tipo} alert-dismissible fade show`;
    notificacion.role = 'alert';
    
    let icono = '';
    
    switch (tipo) {
        case 'success':
            icono = '<i class="fas fa-check-circle me-2"></i>';
            break;
        case 'danger':
            icono = '<i class="fas fa-exclamation-circle me-2"></i>';
            break;
        case 'warning':
            icono = '<i class="fas fa-exclamation-triangle me-2"></i>';
            break;
        default:
            icono = '<i class="fas fa-info-circle me-2"></i>';
    }
    
    notificacion.innerHTML = `
        ${icono}${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    // Agregar al contenedor
    contenedor.appendChild(notificacion);
    
    // Auto-cerrar después de un tiempo
    setTimeout(function() {
        notificacion.classList.remove('show');
        
        setTimeout(function() {
            contenedor.removeChild(notificacion);
        }, 300);
    }, duracion);
}

// Verificar si una URL es válida
function esURLValida(url) {
    try {
        new URL(url);
        return true;
    } catch (error) {
        return false;
    }
}

// Exportar utilidades para uso global
window.utils = {
    formatearFecha,
    formatearFechaInput,
    calcularEdad,
    obtenerIniciales,
    truncarTexto,
    crearEnlaceWhatsApp,
    crearEnlaceEmail,
    validarRUT,
    formatearRUT,
    generarColorDesdeTexto,
    copiarAlPortapapeles,
    crearCSV,
    descargarArchivo,
    generarUUID,
    formatearNumero,
    mostrarNotificacion,
    esURLValida
};
