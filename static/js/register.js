// Validación del formulario
document
    .getElementById("formulario-registro")
    .addEventListener("submit", function (e) {
        e.preventDefault();

        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirm_password").value;

        if (password !== confirmPassword) {
            alert("Las contraseñas no coinciden");
            return;
        }

        // Cambiar texto del botón
        const btnRegistro = document.getElementById("btn-registro");
        const originalText = btnRegistro.textContent;
        btnRegistro.textContent = "REGISTRANDO...";
        btnRegistro.disabled = true;

        // Lanzar confeti
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#f97316", "#ea580c", "#FDE047"],
        });

        // Mostrar modal de celebración
        document.getElementById("celebration-modal").classList.remove("hidden");
        const modalContent = document.getElementById("modal-content");
        setTimeout(() => {
            modalContent.classList.remove("scale-95", "opacity-0");
            modalContent.classList.add("scale-100", "opacity-100");
        }, 10);

        // Enviar formulario real a Flask
        setTimeout(() => {
            btnRegistro.textContent = originalText;
            btnRegistro.disabled = false;
            this.submit(); // Envía el formulario a Flask
        }, 2000);
    });

// Cerrar modal
function closeCelebrationModal() {
    const modal = document.getElementById("celebration-modal");
    const modalContent = document.getElementById("modal-content");

    modalContent.classList.add("scale-95", "opacity-0");
    modalContent.classList.remove("scale-100", "opacity-100");

    setTimeout(() => {
        modal.classList.add("hidden");
    }, 300);
}

// Event listener para cerrar modal
document
    .getElementById("close-modal")
    .addEventListener("click", closeCelebrationModal);

// Cerrar modal al hacer clic fuera
document
    .getElementById("celebration-modal")
    .addEventListener("click", function (e) {
        if (e.target === this) {
            closeCelebrationModal();
        }
    });
