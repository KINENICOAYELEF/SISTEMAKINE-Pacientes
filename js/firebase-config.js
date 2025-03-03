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
firebase.initializeApp(firebaseConfig);

// Referencias a servicios de Firebase
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Configuración de Firestore
db.settings({ timestampsInSnapshots: true });

// Función para verificar si el usuario está autenticado
function checkAuth() {
  auth.onAuthStateChanged(user => {
    if (!user && !window.location.href.includes('index.html') && !window.location.href.includes('registro.html')) {
      window.location.href = 'index.html';
    }
  });
}

// Ejecutar verificación de autenticación en cada página
checkAuth();
