let cartItems = [];
const cartPanel = document.getElementById("cart-panel");
const cartCount = document.getElementById("cart-count");
const cartContainer = document.getElementById("cart");

// Toggle carrito
document.getElementById("cart-toggle").addEventListener("click", () => {
  cartPanel.classList.toggle("hidden");
});

// Agregar producto al carrito
document.querySelectorAll(".add-to-cart-btn").forEach((button) => {
  button.addEventListener("click", (e) => {
    e.preventDefault();
    const card = button.closest(".product-card");
    const name = card.getAttribute("data-name");
    const price = parseFloat(card.getAttribute("data-price"));
    const image = card.querySelector("img").src;

    const existingItem = cartItems.find((item) => item.name === name);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cartItems.push({ name, price, quantity: 1, image });
    }

    updateCart();
  });
});

function updateCart() {
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;

  cartContainer.innerHTML = "";

  if (cartItems.length === 0) {
    cartContainer.innerHTML = '<p class="text-gray-600 text-lg">No hay productos en el carrito.</p>';
    return;
  }

  let totalPrice = 0;

  cartItems.forEach((item, index) => {
    totalPrice += item.price * item.quantity;

    const itemDiv = document.createElement("div");
    itemDiv.className = "cart-item";
    itemDiv.innerHTML = `
      <div class="flex items-center gap-4 w-full mb-4">
        <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded-md" />
        <div class="flex-1 min-w-0">
          <h4 class="text-base font-semibold truncate">${item.name}</h4>
          <p class="text-orange-500 font-bold">S/${item.price.toFixed(2)}</p>
        </div>
        <div class="flex flex-col items-center gap-2">
          <div class="flex items-center gap-2">
            <button class="decrease-qty bg-gray-700 hover:bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center">-</button>
            <span class="text-black font-semibold">${item.quantity}</span>
            <button class="increase-qty bg-gray-700 hover:bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center">+</button>
          </div>
          <button class="remove-item text-red-500 hover:text-red-700">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `;

    cartContainer.appendChild(itemDiv);

    // Eventos dinámicos
    itemDiv.querySelector(".increase-qty").addEventListener("click", () => {
      cartItems[index].quantity++;
      updateCart();
    });

    itemDiv.querySelector(".decrease-qty").addEventListener("click", () => {
      if (cartItems[index].quantity > 1) {
        cartItems[index].quantity--;
      } else {
        cartItems.splice(index, 1);
      }
      updateCart();
    });

    itemDiv.querySelector(".remove-item").addEventListener("click", () => {
      cartItems.splice(index, 1);
      updateCart();
    });
  });

  const totalDiv = document.createElement("div");
  totalDiv.className = "mt-6 pt-4 border-t border-gray-300 text-xl font-semibold text-black";
  totalDiv.innerText = `Total: S/${totalPrice.toFixed(2)}`;
  cartContainer.appendChild(totalDiv);

  const buyButton = document.createElement("button");
  buyButton.className = "buy-button block w-full mt-4 py-3 rounded-md bg-orange-500 hover:bg-orange-600 text-white font-bold transition shadow-md";
  buyButton.innerText = "Proceder al pago";
  buyButton.addEventListener("click", () => {
    window.location.href = "/payment"; // Redirigir a página de pago
  });
  cartContainer.appendChild(buyButton);
}

// Cerrar carrito solo si se hace clic fuera
document.addEventListener("click", (e) => {
  const isInsideCart = cartPanel.contains(e.target) || document.getElementById("cart-toggle").contains(e.target);
  if (!isInsideCart && !cartPanel.classList.contains("hidden")) {
    cartPanel.classList.add("hidden");
  }
});

updateCart(); // Inicializar carrito vacío