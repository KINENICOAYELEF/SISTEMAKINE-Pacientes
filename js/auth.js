// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBYaNbZWHUS-Pvm49kmMtHw9LqqxUDySYA",
    authDomain: "base-de-datos-poli.firebaseapp.com",
    projectId: "base-de-datos-poli",
    storageBucket: "base-de-datos-poli.firebasestorage.app",
    messagingSenderId: "954754202697",
    appId: "1:954754202697:web:e06171f6b0ade314259398"
};

// Inicializar Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Referencias a servicios de Firebase
const auth = firebase.auth();
const db = firebase.firestore();

// Estado de autenticación
let currentUser = null;

// Listener para cambios en el estado de autenticación
auth.onAuthStateChanged(function(user) {
    currentUser = user;
    
    // Ejecutar callback si existe
    if (window.onAuthStateChanged) {
        window.onAuthStateChanged(user);
    }
});

// Funciones de autenticación
const authFunctions = {
    // Iniciar sesión con email y contraseña
    loginWithEmail: function(email, password) {
        return auth.signInWithEmailAndPassword(email, password);
    },
    
    // Registrar nuevo usuario
    registerWithEmail: function(email, password, userData) {
        return auth.createUserWithEmailAndPassword(email, password)
            .then(function(credential) {
                const user = credential.user;
                
                // Actualizar perfil con el nombre
                if (userData.nombre) {
                    return user.updateProfile({
                        displayName: userData.nombre
                    }).then(function() {
                        // Guardar datos adicionales en Firestore
                        return db.collection('usuarios').doc(user.uid).set({
                            ...userData,
                            fechaRegistro: new Date()
                        });
                    });
                }
                
                return Promise.resolve();
            });
    },
    
    // Cerrar sesión
    logout: function() {
        return auth.signOut();
    },
    
    // Recuperar contraseña
    resetPassword: function(email) {
        return auth.sendPasswordResetEmail(email);
    },
    
    // Obtener usuario actual
    getCurrentUser: function() {
        return currentUser;
    },
    
    // Verificar si hay un usuario autenticado
    isAuthenticated: function() {
        return currentUser !== null;
    },
    
    // Actualizar perfil de usuario
    updateProfile: function(data) {
        if (!currentUser) {
            return Promise.reject(new Error('No hay usuario autenticado'));
        }
        
        const updates = {};
        
        // Actualizar displayName y/o photoURL si se proporcionan
        if (data.nombre) {
            updates.displayName = data.nombre;
        }
        
        if (data.photoURL) {
            updates.photoURL = data.photoURL;
        }
        
        // Primero actualizar perfil de auth
        return currentUser.updateProfile(updates)
            .then(function() {
                // Luego actualizar datos en Firestore
                return db.collection('usuarios').doc(currentUser.uid).update({
                    ...data,
                    fechaActualizacion: new Date()
                });
            });
    },
    
    // Cambiar contraseña
    changePassword: function(newPassword) {
        if (!currentUser) {
            return Promise.reject(new Error('No hay usuario autenticado'));
        }
        
        return currentUser.updatePassword(newPassword);
    },
    
    // Reautenticar usuario (necesario para operaciones sensibles)
    reauthenticate: function(password) {
        if (!currentUser) {
            return Promise.reject(new Error('No hay usuario autenticado'));
        }
        
        const credential = firebase.auth.EmailAuthProvider.credential(
            currentUser.email,
            password
        );
        
        return currentUser.reauthenticateWithCredential(credential);
    }
};

// Verificar si la página requiere autenticación
document.addEventListener('DOMContentLoaded', function() {
    // Lista de páginas que no requieren autenticación
    const publicPages = ['index.html', 'login.html'];
    
    // Obtener nombre de la página actual
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Si no es una página pública y no hay usuario autenticado, redirigir al login
    if (!publicPages.includes(currentPage) && !auth.currentUser) {
        auth.onAuthStateChanged(function(user) {
            if (!user) {
                window.location.href = 'login.html';
            }
        });
    }
});
