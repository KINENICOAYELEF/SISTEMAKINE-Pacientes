# SISTEMAKINE - Sistema de Fichas Clínicas Kinesiológicas

## Descripción del Proyecto
SISTEMAKINE es un sistema completo de gestión de fichas clínicas kinesiológicas dividido en dos sitios web interconectados:

1. **SISTEMAKINE-Pacientes**: Enfocado en la gestión de pacientes, registro de datos y evoluciones
2. **SISTEMAKINE-Clínico**: Orientado al diagnóstico, planificación de tratamiento y análisis de datos

Ambos sitios comparten una base de datos Firebase para mantener la información sincronizada.

## Estado Actual del Proyecto
Actualmente estamos desarrollando el SITIO 1 (SISTEMAKINE-Pacientes).

### Componentes Implementados
- [x] Estructura base del sitio
- [x] Configuración de Firebase
- [x] Formulario de ingreso de pacientes (parcial)
- [x] Sistema de autenticación
- [x] Acrónimo SINSS

### Componentes En Desarrollo
- [ ] Completar el formulario de ingreso de pacientes con las secciones restantes
- [ ] Lista de pacientes
- [ ] Ficha de visualización de paciente
- [ ] Sistema de evoluciones

### Pendientes
- [ ] Dashboard de pacientes
- [ ] Exportación de datos
- [ ] Conexión con SISTEMAKINE-Clínico

## Estructura del Proyecto

### Archivos HTML
- `index.html` - Página principal/landing
- `login.html` - Página de inicio de sesión
- `dashboard.html` - Panel principal tras iniciar sesión
- `nuevo-paciente.html` - Formulario de ingreso de pacientes
- `listado-pacientes.html` - Lista de pacientes registrados
- `ver-paciente.html` - Visualización de datos de un paciente
- `editar-paciente.html` - Edición de datos de un paciente
- `evolucion.html` - Registro de evoluciones

### Carpeta CSS
- `styles.css` - Estilos generales del sitio

### Carpeta JS
- `auth.js` - Gestión de autenticación con Firebase
- `database.js` - Configuración y funciones de Firestore
- `firebase-config.js` - Configuración de Firebase
- `pacientes.js` - Funcionalidades específicas de pacientes
- `evolucion.js` - Funcionalidades para evoluciones
- `utils.js` - Funciones de utilidad general

## Secciones faltantes en el formulario de ingreso

Comparando el formulario actual con la ficha completa, detectamos que faltan implementar las siguientes secciones:

### Secciones principales que faltan:
1. **Factores adicionales** (agravantes, aliviantes, comportamiento del dolor)
2. **Mapa Corporal Interactivo** - No implementado
3. **Sección 5 completa: Evaluación Física** (signos vitales, antropometría, evaluación postural, etc.)
4. **Sección 6 completa: Escalas y Cuestionarios Estandarizados**
5. **Sección 7 completa: Sistema de Banderas de Alerta**
6. **Sección 9 completa: Documentación Complementaria**

### Elementos específicos faltantes en secciones existentes:
1. **Tiempo de espera desde derivación** (en 2.1)
2. **Experiencias previas con kinesiología** (en 2.3)
3. **Creencias sobre su condición** (en 2.3)
4. **Barreras y facilitadores percibidos para la recuperación** (en 2.3)
5. **Historial de rehabilitación previa** (en 3.1)
6. **Uso de órtesis o ayudas técnicas** (en 3.1)
7. **Historial de tratamientos alternativos** (en 3.1)
8. **Historial de actividad física previa** (en 3.1)
9. **Inmunizaciones** (en 3.1)
10. **Evaluación de fragilidad y tests para adultos mayores** (en 3.1)
11. **Fecha de inicio de medicamentos** (en 3.3)
12. **Medicamentos suspendidos recientemente** (en 3.3)
13. **Automedicación** (en 3.3)
14. **Uso de medicina alternativa** (en 3.3)
15. **Sensibilidad a modalidades físicas** (en 3.4)
16. **Protocolo de acción en caso de reacción alérgica** (en 3.4)
17. **Tipo de entrenamiento específico y detalles relacionados con deportes** (en 4.3)
18. **Factores sociales relevantes y restricción de participación** (en 4.5)
19. **Estrategias de afrontamiento** (en 4.5)
20. **Actividades sociales habituales** (en 4.5)
21. **Impacto de la condición en las relaciones sociales** (en 4.5)
22. **Recursos comunitarios disponibles** (en 4.5)

### Prioridades para implementación:

**Alta prioridad:**
- ✅ Acrónimo SINSS (implementado)
- Factores adicionales del dolor
- Documentación Complementaria (carga de archivos)
- Sistema de Banderas de Alerta
- Mapa Corporal Interactivo (implementación simplificada)

**Media prioridad:**
- Evaluación Física básica
- Escalas y Cuestionarios principales (EVA, QuickDASH, WOMAC, NDI, Oswestry)

**Baja prioridad:**
- Cuestionarios específicos completos
- Elementos de detalle en secciones existentes

## Tecnologías Utilizadas
- HTML5, CSS3, JavaScript
- Bootstrap 5 para diseño responsive
- Firebase (Authentication, Firestore, Storage)
- Font Awesome para iconos
- GitHub Pages para hosting

## Configuración del Proyecto

### Credenciales Firebase:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyBYaNbZWHUS-Pvm49kmMtHw9LqqxUDySYA",
  authDomain: "base-de-datos-poli.firebaseapp.com",
  projectId: "base-de-datos-poli",
  storageBucket: "base-de-datos-poli.firebasestorage.app",
  messagingSenderId: "954754202697",
  appId: "1:954754202697:web:e06171f6b0ade314259398"
};
