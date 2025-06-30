// Función para mostrar u ocultar el menú móvil
document.getElementById("menu-btn").addEventListener("click", () => {
    document.getElementById("menu").classList.toggle("hidden");
});


// Función para mostrar u ocultar el carrito
document.getElementById("cart-toggle").addEventListener("click", () => {
    const cartPanel = document.getElementById("cart-panel");
    cartPanel.classList.toggle("hidden");
});


// Función para mostrar el modal de promoción
function showPromoModal() {
    const modal = document.getElementById("promo-modal");
    const modalContent = modal.querySelector(".transform");

    modal.classList.remove("hidden");
    setTimeout(() => {
        modalContent.style.transform = "scale(1)";
        modalContent.style.opacity = "1";
    }, 10);
}


// Función para ocultar el modal de promoción
function hidePromoModal() {
    const modal = document.getElementById("promo-modal");
    const modalContent = modal.querySelector(".transform");

    modalContent.style.transform = "scale(0.95)";
    modalContent.style.opacity = "0";

    setTimeout(() => {
        modal.classList.add("hidden");
    }, 300);
}


// Mostrar modal automáticamente después de 2 segundos
window.addEventListener("load", function () {
    setTimeout(showPromoModal, 2000);
});


// Cerrar modal con el botón
document.getElementById("close-promo-modal").addEventListener("click", hidePromoModal);


// Cerrar modal al hacer clic fuera del contenido
document.getElementById("promo-modal").addEventListener("click", (e) => {
    if (e.target === document.getElementById("promo-modal")) {
        hidePromoModal();
    }
});


// Funcionalidad básica del carrito
let cartItems = [];
const cartCount = document.getElementById("cart-count");
const cartContainer = document.getElementById("cart");


document.querySelectorAll(".add-to-cart-btn").forEach(btn => {
    btn.addEventListener("click", function () {
        const productCard = this.closest(".bg-white");
        const productName = productCard.querySelector("h3").textContent;
        const productPrice = productCard.querySelector(".text-orange-500").textContent;
        const productImage = productCard.querySelector("img").src;

        // Agregar producto al carrito
        cartItems.push({
            name: productName,
            price: productPrice,
            image: productImage
        });

        // Actualizar contador
        cartCount.textContent = cartItems.length;

        // Actualizar vista del carrito
        updateCartView();

        // Mostrar feedback
        alert(`¡${productName} agregado al carrito!`);
    });
});


function updateCartView() {
    if (cartItems.length === 0) {
        cartContainer.innerHTML = '<p class="text-gray-600 text-lg">No hay productos en el carrito.</p>';
        return;
    }

    let cartHTML = '';
    cartItems.forEach(item => {
        cartHTML += `
      <div class="flex items-center justify-between border-b border-gray-200 pb-4">
        <div class="flex items-center space-x-4">
          <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded">
          <div>
            <h4 class="font-medium">${item.name}</h4>
            <p class="text-orange-500 font-bold">${item.price}</p>
          </div>
        </div>
        <button class="remove-item text-gray-500 hover:text-red-500">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;
    });

    // Agregar total y botón de compra
    cartHTML += `
    <div class="mt-6 pt-4 border-t border-gray-200">
      <div class="flex justify-between items-center mb-6">
        <span class="font-bold">Total:</span>
        <span class="text-orange-500 font-bold text-xl">S/ ${calculateTotal()}</span>
      </div>
      <button class="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition">
        Proceder al Pago
      </button>
    </div>
  `;

    cartContainer.innerHTML = cartHTML;

    // Agregar eventos a los botones de eliminar
    document.querySelectorAll(".remove-item").forEach(btn => {
        btn.addEventListener("click", function () {
            const itemIndex = Array.from(this.closest(".flex").parentNode.children).indexOf(this.closest(".flex"));
            cartItems.splice(itemIndex, 1);
            cartCount.textContent = cartItems.length;
            updateCartView();
        });
    });
}


function calculateTotal() {
    // Esto es una simplificación - en una aplicación real deberías parsear los precios correctamente
    return cartItems.length * 100;
}
