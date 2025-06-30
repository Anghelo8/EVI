const registroModal = document.getElementById('login-form-modal');
const botonAbrirRegistro = document.getElementById('abrir-registro-modal'); // Asegúrate de que este ID coincida con tu botón de "Registrarse"

if (botonAbrirRegistro) {
    botonAbrirRegistro.addEventListener('click', () => {
        registroModal.classList.remove('hidden');
    });
}

const cancelarRegistroBoton = registroModal.querySelector('button[type="button"]'); // Selecciona el botón de cancelar dentro del modal
if (cancelarRegistroBoton) {
    cancelarRegistroBoton.addEventListener('click', () => {
        registroModal.classList.add('hidden');
    });
}

// Opcional: Cerrar el modal al hacer clic fuera de él
registroModal.addEventListener('click', (event) => {
    if (event.target === registroModal) {
        registroModal.classList.add('hidden');
    }
});

function cancelar() {
    window.location.href = "{{ url_for('index') }}";
}

document.getElementById('formulario-registro').addEventListener('submit', function (e) {
    e.preventDefault();
    const password = document.querySelector('input[name="password"]').value;
    const confirmPassword = document.querySelector('input[name="confirm_password"]').value;

    if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
    }

    this.submit();
});

function iniciarSesionGoogle() {
    // Implementar lógica de login con Google
    alert('Login con Google - Funcionalidad en desarrollo');
}

function iniciarSesionFacebook() {
    // Implementar lógica de login con Facebook
    alert('Login con Facebook - Funcionalidad en desarrollo');
}

function iniciarSesionApple() {
    // Implementar lógica de login con Apple
    alert('Login con Apple - Funcionalidad en desarrollo');
}

// Simple script to toggle cart visibility (consistent across pages)
const cartToggle = document.getElementById('cart-toggle');
const cartPanel = document.getElementById('cart-panel');
if (cartToggle && cartPanel) {
    cartToggle.addEventListener('click', () => {
        cartPanel.classList.toggle('hidden');
    });
}
