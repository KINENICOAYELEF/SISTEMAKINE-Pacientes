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

### Componentes En Desarrollo
- [ ] Completar el formulario de ingreso de pacientes con todas las secciones requeridas
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
1. **Acrónimo SINSS** - No implementado en absoluto
2. **Factores adicionales** (agravantes, aliviantes, comportamiento del dolor)
3. **Mapa Corporal Interactivo** - No implementado
4. **Sección 5 completa: Evaluación Física** (signos vitales, antropometría, evaluación postural, etc.)
5. **Sección 6 completa: Escalas y Cuestionarios Estandarizados**
6. **Sección 7 completa: Sistema de Banderas de Alerta**
7. **Sección 9 completa: Documentación Complementaria**
8. **Sección 10 completa: Plan de Tratamiento Inicial**

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
- Acrónimo SINSS
- Factores adicionales del dolor
- Documentación Complementaria (carga de archivos)
- Plan de Tratamiento Inicial
- Mapa Corporal Interactivo (implementación simplificada)

**Media prioridad:**
- Sistema de Banderas de Alerta
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
```

## Diseño del Sistema

### Estructura de Datos en Firestore:

**Colecciones principales:**
- `users` - Información de los kinesiólogos
- `pacientes` - Datos de pacientes
- `evoluciones` - Registros de evolución
- `templates` - Plantillas de tratamiento

**Documento de paciente:**
```javascript
{
  id: "string", // Generado por Firestore
  datosPersonales: {
    // Campos de la sección 1
  },
  motivoConsulta: {
    // Campos de la sección 2
  },
  historiaMedica: {
    // Campos de la sección 3
  },
  habitos: {
    // Campos de la sección 4
  },
  evaluacionFisica: {
    // Campos de la sección 5
  },
  escalas: {
    // Campos de la sección 6
  },
  banderas: {
    // Campos de la sección 7
  },
  documentacion: {
    // Referencias a archivos en Storage
  },
  planTratamiento: {
    // Campos de la sección 10
  },
  consentimiento: {
    // Campos de la sección 11
  },
  fechaCreacion: "timestamp",
  fechaActualizacion: "timestamp",
  kinesiologoId: "string", // Referencia al usuario creador
  estado: "string" // Activo, Inactivo, Archivado
}
```

## Próximos Pasos
1. Completar el formulario de ingreso de pacientes siguiendo las prioridades establecidas
2. Implementar el almacenamiento en Firebase Storage para documentación complementaria
3. Desarrollar el mapa corporal interactivo con interfaz simplificada
4. Implementar la visualización y edición de datos de pacientes
5. Desarrollar el sistema de evoluciones

## Recursos y Referencias
- [Bootstrap 5 Documentation](https://getbootstrap.com/docs/5.3/getting-started/introduction/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Font Awesome Icons](https://fontawesome.com/icons)

## Notas Importantes
- Es crucial mantener la consistencia en la estructura de datos para la integración con el SITIO 2
- Implementar validaciones para campos obligatorios y formatos específicos
- El mapa corporal interactivo puede requerir el uso de una biblioteca específica como FabricJS o una implementación basada en SVG
- Las escalas estandarizadas deben implementar el cálculo automático de puntajes según sus algoritmos específicos

## Plan de Implementación Progresiva
Para no sobrecargar el sistema de una sola vez, se recomienda una implementación por fases:

**Fase 1 (Actual):**
- Formulario de ingreso básico con datos personales, motivo de consulta, historia médica básica, hábitos y consentimiento.

**Fase 2:**
- Integración del mapa corporal y factores adicionales de dolor
- Implementación del acrónimo SINSS
- Plan de tratamiento inicial

**Fase 3:**
- Sistema de banderas de alerta
- Evaluación física básica
- Carga de documentación complementaria

**Fase 4:**
- Escalas y cuestionarios principales
- Refinamiento de la interfaz de usuario
- Optimización de la experiencia móvil

**Fase 5:**
- Implementación completa de todas las secciones restantes
- Integración con el SITIO 2 (SISTEMAKINE-Clínico)
