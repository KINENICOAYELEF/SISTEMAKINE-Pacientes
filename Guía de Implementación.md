# Guía de Implementación de SISTEMAKINE

Esta guía te ayudará a implementar SISTEMAKINE en GitHub Pages y conectar ambos sitios (SISTEMAKINE-Pacientes y SISTEMAKINE-Clínico) a la misma base de datos Firebase.

## 1. Preparación de los Repositorios GitHub

### 1.1 Crear los Repositorios

1. Accede a [GitHub](https://github.com/) e inicia sesión con tu cuenta.
2. Crea dos repositorios nuevos:
   - `sistemakine-pacientes`
   - `sistemakine-clinico`

### 1.2 Estructura de Carpetas

Organiza los archivos en la siguiente estructura para cada repositorio:

**Para sistemakine-pacientes:**
```
sistemakine-pacientes/
├── index.html
├── login.html
├── dashboard.html
├── nuevo-paciente.html
├── listado-pacientes.html
├── ver-paciente.html
├── evolucion.html
├── css/
│   ├── styles.css
├── js/
│   ├── auth.js
│   ├── database.js
│   ├── pacientes.js
│   ├── evolucion.js
│   ├── utils.js
├── img/
│   └── logo.png
└── assets/
    └── body-map.svg
```

**Para sistemakine-clinico:**
```
sistemakine-clinico/
├── index.html
├── login.html
├── dashboard.html
├── diagnostico.html
├── plan-tratamiento.html
├── informes.html
├── dashboard-pacientes.html
├── css/
│   ├── styles.css
├── js/
│   ├── auth.js
│   ├── database.js
│   ├── diagnostico.js
│   ├── tratamiento.js
│   ├── informes.js
│   ├── utils.js
├── img/
│   └── logo.png
└── assets/
    └── body-map.svg
```

## 2. Configuración de Firebase

### 2.1 Crear un Proyecto en Firebase

1. Accede a la [Consola de Firebase](https://console.firebase.google.com/) e inicia sesión con tu cuenta de Google.
2. Crea un nuevo proyecto (o usa el que ya tienes: `base-de-datos-poli`).
3. Habilita los siguientes servicios:
   - Authentication
   - Firestore Database
   - Storage

### 2.2 Configurar Autenticación

1. En la consola de Firebase, ve a "Authentication".
2. Habilita los métodos de autenticación:
   - Email/Password
   - Google (opcional)

### 2.3 Configurar Reglas de Firestore

1. En la consola de Firebase, ve a "Firestore Database".
2. Ve a la pestaña "Reglas" y establece las siguientes reglas:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 2.4 Configurar Reglas de Storage

1. En la consola de Firebase, ve a "Storage".
2. Ve a la pestaña "Reglas" y establece las siguientes reglas:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 3. Configuración para Compartir la Base de Datos

Para que ambos sitios web compartan la misma base de datos, debes usar el mismo `firebaseConfig` en ambos proyectos. Ya tienes esta configuración:

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

Asegúrate de que este mismo objeto `firebaseConfig` esté en el archivo `js/auth.js` de ambos proyectos.

## 4. Subir el Código a GitHub

### 4.1 Inicializar Git en Ambos Proyectos

Desde la terminal, para cada proyecto:

```bash
# Para SISTEMAKINE-Pacientes
cd ruta/a/sistemakine-pacientes
git init
git add .
git commit -m "Versión inicial de SISTEMAKINE-Pacientes"
git branch -M main
git remote add origin https://github.com/tu-usuario/sistemakine-pacientes.git
git push -u origin main

# Para SISTEMAKINE-Clínico
cd ruta/a/sistemakine-clinico
git init
git add .
git commit -m "Versión inicial de SISTEMAKINE-Clínico"
git branch -M main
git remote add origin https://github.com/tu-usuario/sistemakine-clinico.git
git push -u origin main
```

Reemplaza `tu-usuario` con tu nombre de usuario de GitHub.

## 5. Configurar GitHub Pages

### 5.1 Habilitar GitHub Pages para Ambos Repositorios

1. Ve a la página de tu repositorio en GitHub.
2. Haz clic en "Settings" (Configuración).
3. Desplázate hacia abajo hasta la sección "GitHub Pages".
4. En "Source", selecciona "main" como la rama y la carpeta raíz ("/") como ubicación.
5. Haz clic en "Save" (Guardar).

GitHub generará una URL para tu sitio, similar a:
- `https://tu-usuario.github.io/sistemakine-pacientes/`
- `https://tu-usuario.github.io/sistemakine-clinico/`

### 5.2 Habilitar HTTPS y Cors para Firebase

Para que Firebase funcione correctamente con GitHub Pages, debes habilitar CORS. Esto ya está configurado en el objeto `firebaseConfig`. Si tienes problemas, verifica:

1. Que estás usando HTTPS en GitHub Pages.
2. Que los dominios de GitHub Pages están permitidos en tu proyecto de Firebase:
   - Ve a Firebase Console > Authentication > Sign-in method > Authorized domains
   - Añade los dominios de GitHub Pages: `tu-usuario.github.io`

## 6. Probando la Conexión entre Sitios

Para verificar que ambos sitios estén conectados a la misma base de datos:

1. Accede a uno de los sitios y crea una cuenta o inicia sesión.
2. Agrega un paciente o datos de prueba.
3. Accede al otro sitio con las mismas credenciales.
4. Verifica que puedas ver los mismos datos creados en el primer sitio.

## 7. Configuraciones Adicionales para SISTEMAKINE-Clínico

Una vez que hayas completado el SITIO 1 (SISTEMAKINE-Pacientes), puedes empezar a desarrollar el SITIO 2 (SISTEMAKINE-Clínico) siguiendo estos pasos:

1. Crear las páginas HTML para todas las funcionalidades requeridas.
2. Adaptar los archivos JavaScript para trabajar con las mismas colecciones de Firestore.
3. Asegurarte de que la autenticación funcione correctamente entre ambos sitios.

## 8. Mantenimiento y Actualizaciones

Para actualizar tus sitios después de realizar cambios:

```bash
# Añadir cambios
git add .

# Crear un commit con descripción
git commit -m "Descripción de los cambios"

# Enviar cambios a GitHub
git push
```

GitHub Pages se actualizará automáticamente después de cada push.

## 9. Problemas comunes y soluciones

### Problema: Los sitios no comparten la misma base de datos

**Solución:**
- Verifica que ambos sitios estén usando exactamente el mismo objeto `firebaseConfig`.
- Comprueba que las reglas de seguridad de Firestore permitan el acceso desde ambos dominios.

### Problema: Error de CORS en GitHub Pages

**Solución:**
- Asegúrate de usar `https://` en todas las URL.
- Añade los dominios de GitHub Pages a los dominios autorizados en Firebase Authentication.

### Problema: Archivos de Firebase no cargan

**Solución:**
- Verifica que estás usando las versiones correctas de las bibliotecas Firebase:
```html
<script src="https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.6.10/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.6.10/firebase-storage-compat.js"></script>
```

## 10. Recursos adicionales

- [Documentación de Firebase](https://firebase.google.com/docs)
- [Documentación de GitHub Pages](https://docs.github.com/en/pages)
- [Bootstrap Documentation](https://getbootstrap.com/docs/5.3/getting-started/introduction/)
