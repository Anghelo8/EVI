// Se ejecuta cuando el DOM está completamente cargado
document.addEventListener("DOMContentLoaded", () => {
  // Configuración del formulario de pago
  const paymentFormModal = document.getElementById("payment-form-modal");
  const paymentForm = document.getElementById("payment-form");
  const cancelPaymentBtn = document.getElementById("cancel-payment");

  paymentForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const paymentMethod = document.getElementById("payment-method").value;
    if (paymentMethod === "card") {
      alert(
        "Método de pago guardado con éxito. Ahora puede completar su compra."
      );
      paymentFormModal.classList.add("hidden");
      document.getElementById("cart-panel").classList.remove("hidden");
    } else if (paymentMethod === "yape") {
      const yapeForm = document.getElementById("yape-form");
      yapeForm.classList.remove("hidden");
      const cardDetails = document.getElementById("card-details");
      cardDetails.classList.add("hidden");
    }
  });

  cancelPaymentBtn.addEventListener("click", () => {
    paymentFormModal.classList.add("hidden");
    document.getElementById("cart-panel").classList.remove("hidden");
  });

  // Configuración del formulario de registro
  const loginCtaBtn = document.getElementById("login-cta-btn");
  const loginFormModal = document.getElementById("login-form-modal");
  const registerForm = document.getElementById("register-form");
  const cancelRegisterBtn = document.getElementById("cancel-register");

  // Función para cerrar el modal de registro
  function closeRegisterModal() {
    loginFormModal.classList.add("hidden");
  }

  // Evento para cerrar al hacer clic en el botón cancelar
  cancelRegisterBtn.addEventListener("click", closeRegisterModal);

  // Evento para cerrar al hacer clic fuera del modal
  loginFormModal.addEventListener("click", (e) => {
    if (e.target === loginFormModal) {
      closeRegisterModal();
    }
  });

  // Evento para abrir el modal
  loginCtaBtn.addEventListener("click", () => {
    loginFormModal.classList.remove("hidden");
  });

  // Evento para el envío del formulario de registro
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    closeRegisterModal();
    alert("Registro exitoso. ¡Bienvenido a Josesito.co!");
  });

  // Configuración de botones de inicio de sesión social
  const socialButtons = document.querySelectorAll(".bg-[#444]");
  socialButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const platform = button.querySelector("img").alt;
      alert(`Iniciando sesión con ${platform}...`);
      closeRegisterModal();
    });
  });

  // Mostrar/ocultar detalles de tarjeta según método de pago
  document.getElementById("payment-method").addEventListener("change", (e) => {
    const cardDetails = document.getElementById("card-details");
    const yapeForm = document.getElementById("yape-form");
    if (e.target.value === "card") {
      cardDetails.classList.remove("hidden");
      yapeForm.classList.add("hidden");
    } else if (e.target.value === "yape") {
      yapeForm.classList.remove("hidden");
      cardDetails.classList.add("hidden");
    } else {
      cardDetails.classList.add("hidden");
      yapeForm.classList.add("hidden");
    }
  });

  // Configuración del botón de scroll hacia arriba
  const scrollTopBtn = document.getElementById("scrollTopBtn");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      scrollTopBtn.classList.remove("hidden");
    } else {
      scrollTopBtn.classList.add("hidden");
    }
  });

  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  const content = document.getElementById("content");
  loader.classList.add("hidden");
  content.classList.remove("hidden");
});

const linkElement = document.createElement('link');
linkElement.rel = 'stylesheet';
linkElement.type = 'text/css';
linkElement.href = '/static/css/cart.css'; // Reemplaza con la URL correcta
document.head.appendChild(linkElement);

            document.getElementById('login-cta-btn').addEventListener('click', function() {
                window.location.href = 'register.html';
            });
