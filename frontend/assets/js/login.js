/**
 * login.js - Gestión de autenticación para Mi Brújula de Conocimiento
 */

// Variables globales
let currentUser = null;

// Elementos del DOM
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const loginFormElement = document.getElementById('loginFormElement');
const registerFormElement = document.getElementById('registerFormElement');
const showRegisterBtn = document.getElementById('showRegister');
const showLoginBtn = document.getElementById('showLogin');
const messageDiv = document.getElementById('message');

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    console.log('Login page loaded');
    
    // Verificar si hay una sesión activa
    checkExistingSession();
    
    // Configurar event listeners
    setupEventListeners();
});

function setupEventListeners() {
    // Cambiar entre formularios
    showRegisterBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showRegisterForm();
    });
    
    showLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showLoginForm();
    });
    
    // Formularios
    loginFormElement.addEventListener('submit', handleLogin);
    registerFormElement.addEventListener('submit', handleRegister);
}

function showRegisterForm() {
    loginForm.classList.remove('active');
    registerForm.classList.add('active');
    clearMessage();
}

function showLoginForm() {
    registerForm.classList.remove('active');
    loginForm.classList.add('active');
    clearMessage();
}

function clearMessage() {
    messageDiv.textContent = '';
    messageDiv.className = 'message';
}

function showMessage(text, type = 'info') {
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
}

async function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const username = formData.get('username').trim();
    const password = formData.get('password').trim();
    
    if (!username || !password) {
        showMessage('Por favor completa todos los campos', 'error');
        return;
    }
    
    // Mostrar estado de carga
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    clearMessage();
    
    try {
        console.log('Intentando autenticar usuario:', username);
        const response = await window.api.authenticateUser(username, password);
        
        if (response.success) {
            currentUser = response.user;
            showMessage(`¡Bienvenido, ${response.user.username}!`, 'success');
            
            // Guardar sesión localmente
            localStorage.setItem('currentUser', JSON.stringify(response.user));
            
            // Redirigir a la aplicación principal después de un breve delay
            setTimeout(() => {
                redirectToMainApp();
            }, 1500);
            
        } else {
            showMessage(response.error || 'Error de autenticación', 'error');
        }
        
    } catch (error) {
        console.error('Error durante el login:', error);
        showMessage('Error de conexión. Inténtalo de nuevo.', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const username = formData.get('username').trim();
    const email = formData.get('email').trim();
    const password = formData.get('password').trim();
    const passwordConfirm = formData.get('passwordConfirm').trim();
    
    // Validaciones
    if (!username || !email || !password || !passwordConfirm) {
        showMessage('Por favor completa todos los campos', 'error');
        return;
    }
    
    if (password !== passwordConfirm) {
        showMessage('Las contraseñas no coinciden', 'error');
        return;
    }
    
    if (password.length < 6) {
        showMessage('La contraseña debe tener al menos 6 caracteres', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showMessage('Por favor ingresa un email válido', 'error');
        return;
    }
    
    // Mostrar estado de carga
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    clearMessage();
    
    try {
        console.log('Intentando registrar usuario:', username);
        const response = await window.api.registerUser({
            username,
            email,
            password
        });
        
        if (response.success) {
            showMessage('¡Cuenta creada exitosamente! Ya puedes iniciar sesión.', 'success');
            
            // Limpiar formulario y cambiar a login
            e.target.reset();
            setTimeout(() => {
                showLoginForm();
            }, 2000);
            
        } else {
            showMessage(response.error || 'Error al crear la cuenta', 'error');
        }
        
    } catch (error) {
        console.error('Error durante el registro:', error);
        showMessage('Error de conexión. Inténtalo de nuevo.', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
    }
}

function checkExistingSession() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        try {
            currentUser = JSON.parse(savedUser);
            console.log('Sesión existente encontrada:', currentUser.username);
            showMessage(`Sesión activa para ${currentUser.username}`, 'info');
            
            // Dar opción de continuar o cerrar sesión
            setTimeout(() => {
                if (confirm(`¿Continuar como ${currentUser.username}?`)) {
                    redirectToMainApp();
                } else {
                    logout();
                }
            }, 1000);
        } catch (error) {
            console.error('Error al recuperar sesión:', error);
            localStorage.removeItem('currentUser');
        }
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    clearMessage();
    showLoginForm();
}

function redirectToMainApp() {
    console.log('Redirigiendo a la aplicación principal...');
    // Usar el método IPC para abrir la ventana principal
    window.api.openMainApp()
        .then(response => {
            if (response.success) {
                console.log('Ventana principal abierta exitosamente');
                // La ventana de login se cerrará automáticamente desde main.js
            } else {
                console.error('Error abriendo ventana principal:', response.error);
                showMessage('Error abriendo la aplicación', 'error');
            }
        })
        .catch(error => {
            console.error('Error en comunicación IPC:', error);
            showMessage('Error de conexión', 'error');
        });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Utilidades para session management
function getCurrentUser() {
    return currentUser;
}

function isLoggedIn() {
    return currentUser !== null;
}

// Exportar funciones para uso global si es necesario
window.authUtils = {
    getCurrentUser,
    isLoggedIn,
    logout
};
