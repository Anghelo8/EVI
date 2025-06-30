const paymentModal = new PaymentModal();
const loginModal = new LoginModal();

function mostrarPaymentModal() {
    paymentModal.mostrar();
}

function mostrarLoginModal() {
    loginModal.mostrar();
}

function cerrarPaymentModal() {
    paymentModal.cerrar();
}

function cerrarLoginModal() {
    loginModal.cerrar();
}

class Modal {
    constructor(modalId) {
        this.modal = document.getElementById(modalId);
    }

    mostrar() {
        this.modal.classList.remove("opacity-0", "pointer-events-none");
        this.modal.classList.add("opacity-100");
    }

    cerrar() {
        this.modal.classList.remove("opacity-100");
        this.modal.classList.add("opacity-0", "pointer-events-none");
    }
}

class PaymentModal extends Modal {
    constructor() {
        super("payment-form-modal");
        this.yapeForm = document.getElementById("yape-form");
        this.plinForm = document.getElementById("plin-form");
        this.cardDetails = document.getElementById("card-details");
        this.paymentMethodSelect = document.getElementById("payment-method");
        this.paymentMethodSelect.addEventListener("change", (e) =>
            this.mostrarFormularioPago(e.target.value)
        );
    }

    mostrarFormularioPago(metodo) {
        this.yapeForm.classList.add("hidden");
        this.plinForm.classList.add("hidden");
        this.cardDetails.classList.add("hidden");

        if (metodo === "yape") {
            this.yapeForm.classList.remove("hidden");
        } else if (metodo === "plin") {
            this.plinForm.classList.remove("hidden");
        } else if (metodo === "card") {
            this.cardDetails.classList.remove("hidden");
        }
    }
}

class LoginModal extends Modal {
    constructor() {
        super("login-form-modal");
    }
}
