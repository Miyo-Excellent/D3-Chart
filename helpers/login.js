// Muestra el off-canvas de login si el usuario no está autenticado
function showLogin() {
    var loginDiv = document.getElementById('loginDiv');
    loginDiv.style.display = 'block';
}

// Oculta el off-canvas de login cuando el usuario se autentica correctamente
function hideLogin() {
    var loginDiv = document.getElementById('loginDiv');
    loginDiv.style.display = 'none';
}

// Este es el handler para el botón de login
function login() {
    var inputPassword = document.getElementById('passwordInput').value;
    if (inputPassword === '12532') {
        localStorage.setItem('authenticated', 'true');
        hideLogin();
    } else {
        alert('Contraseña incorrecta. Inténtalo de nuevo.');
    }
}

// Cuando la página se carga, muestra el login si el usuario no está autenticado
document.addEventListener('DOMContentLoaded', (event) => {
    if (!localStorage.getItem('authenticated')) {
        showLogin();
    }
});
