
// Sample product data for Rines
const products = [
    {
        id: 1,
        name: "BBS CH-R 18x8.5",
        brand: "bbs",
        size: "18",
        material: "forged",
        price: 1200,
        oldPrice: 1500,
        image: "https://placehold.co/400x400/1f2937/white?text=BBS+CH-R",
        rating: 5,
        inStock: true,
        specs: ["Forjado de una pieza", "Peso ultraligero", "Acabado mate", "Compatible con frenos Brembo"]
    },
    {
        id: 2,
        name: "OZ Ultraleggera 17x7.5",
        brand: "oz",
        size: "17",
        material: "aluminum",
        price: 800,
        oldPrice: 1000,
        image: "https://placehold.co/400x400/dc2626/white?text=OZ+RACING",
        rating: 5,
        inStock: true,
        specs: ["Aleación ligera", "Diseño racing", "Múltiples colores", "Certificación TÜV"]
    },
    {
        id: 3,
        name: "Enkei RPF1 16x7",
        brand: "enkei",
        size: "16",
        material: "aluminum",
        price: 600,
        oldPrice: 750,
        image: "https://placehold.co/400x400/eab308/white?text=ENKEI+RPF1",
        rating: 4,
        inStock: true,
        specs: ["MAT Technology", "Peso reducido", "Resistencia superior", "Diseño clásico"]
    },
    {
        id: 4,
        name: "Rays Volk TE37 18x9.5",
        brand: "rays",
        size: "18",
        material: "forged",
        price: 2200,
        oldPrice: 2750,
        image: "https://placehold.co/400x400/059669/white?text=RAYS+VOLK",
        rating: 5,
        inStock: true,
        specs: ["Forjado japonés", "Icónico diseño", "Máxima resistencia", "Edición limitada"]
    },
    {
        id: 5,
        name: "Work Emotion CR Kiwami 17x9",
        brand: "work",
        size: "17",
        material: "aluminum",
        price: 1000,
        oldPrice: 1250,
        image: "https://placehold.co/400x400/7c3aed/white?text=WORK+EMOTION",
        rating: 4,
        inStock: true,
        specs: ["Construcción de 2 piezas", "Diseño agresivo", "Múltiples offsets", "Calidad japonesa"]
    },
    {
        id: 6,
        name: "BBS LM 19x8.5",
        brand: "bbs",
        size: "19",
        material: "forged",
        price: 1800,
        oldPrice: 2250,
        image: "https://placehold.co/400x400/1f2937/white?text=BBS+LM",
        rating: 5,
        inStock: true,
        specs: ["3 piezas modulares", "Centro forjado", "Aro de aluminio", "Personalizable"]
    }
];

let cart = [];
let filteredProducts = [...products];

// DOM Elements
const productsContainer = document.getElementById('products-container');
const cartToggle = document.getElementById('cart-toggle');
const cartSidebar = document.getElementById('cart-sidebar');
const closeCart = document.getElementById('close-cart');
const cartCount = document.getElementById('cart-count');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const productModal = document.getElementById('product-modal');
const closeModal = document.getElementById('close-modal');
const searchInput = document.getElementById('search-input');
const sortSelect = document.getElementById('sort-select');
const clearFilters = document.getElementById('clear-filters');

// Initialize
document.addEventListener('DOMContentLoaded', function () {
    renderProducts();
    setupEventListeners();
});

// Render products
function renderProducts() {
    productsContainer.innerHTML = '';

    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productsContainer.appendChild(productCard);
    });

    document.getElementById('results-count').textContent = filteredProducts.length;
}

// Create product card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1';

    const discount = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);

    card.innerHTML = `
                <div class="relative">
                    <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover">
                    <div class="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        ${discount}% OFF
                    </div>
                    <div class="absolute top-3 left-3">
                        <span class="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            ${product.inStock ? 'En Stock' : 'Agotado'}
                        </span>
                    </div>
                </div>
                <div class="p-6">
                    <h3 class="text-lg font-bold text-gray-900 mb-2">${product.name}</h3>
                    <p class="text-sm text-gray-600 mb-2">${product.size}" - ${product.material}</p>
                    <div class="flex items-center mb-3">
                        <div class="flex text-yellow-400 text-sm">
                            ${'<i class="fas fa-star"></i>'.repeat(product.rating)}
                            ${'<i class="far fa-star"></i>'.repeat(5 - product.rating)}
                        </div>
                        <span class="text-xs text-gray-500 ml-2">(${Math.floor(Math.random() * 100) + 20})</span>
                    </div>
                    <div class="flex items-center justify-between mb-4">
                        <div>
                            <span class="text-2xl font-bold text-orange-500">S/ ${product.price}</span>
                            <span class="text-sm text-gray-500 line-through ml-2">S/ ${product.oldPrice}</span>
                        </div>
                    </div>
                    <div class="flex gap-2">
                        <button onclick="addToCart(${product.id})" class="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition transform hover:scale-105">
                            <i class="fas fa-cart-plus mr-2"></i>Agregar
                        </button>
                        <button onclick="openProductModal(${product.id})" class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
            `;

    return card;
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartUI();
    showNotification('Producto agregado al carrito');
}

// Update cart UI
function updateCartUI() {
    cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="text-gray-500 text-center py-8">Tu carrito está vacío</p>';
        cartTotal.textContent = 'S/ 0.00';
        return;
    }

    cartItems.innerHTML = cart.map(item => `
                <div class="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                    <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded">
                    <div class="flex-1">
                        <h4 class="font-semibold text-sm">${item.name}</h4>
                        <p class="text-xs text-gray-600">${item.size}" ${item.material}</p>
                        <div class="flex items-center gap-2 mt-2">
                            <button onclick="updateQuantity(${item.id}, -1)" class="w-6 h-6 border rounded flex items-center justify-center text-xs">-</button>
                            <span class="text-sm font-semibold">${item.quantity}</span>
                            <button onclick="updateQuantity(${item.id}, 1)" class="w-6 h-6 border rounded flex items-center justify-center text-xs">+</button>
                        </div>
                    </div>
                    <div class="text-right">
                        <p class="font-bold text-orange-500">S/ ${(item.price * item.quantity).toFixed(2)}</p>
                        <button onclick="removeFromCart(${item.id})" class="text-red-500 text-xs hover:text-red-700">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `S/ ${total.toFixed(2)}`;
}

// Update quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartUI();
        }
    }
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
}

// Open product modal
function openProductModal(productId) {
    const product = products.find(p => p.id === productId);

    document.getElementById('modal-image').src = product.image;
    document.getElementById('modal-title').textContent = product.name;
    document.getElementById('modal-price').textContent = `S/ ${product.price}`;
    document.getElementById('modal-old-price').textContent = `S/ ${product.oldPrice}`;

    const specsList = document.getElementById('modal-specs');
    specsList.innerHTML = product.specs.map(spec => `<li>• ${spec}</li>`).join('');

    productModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

// Close product modal
function closeProductModal() {
    productModal.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// Filter products
function filterProducts() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedBrands = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);
    const selectedPrice = document.querySelector('input[name="price"]:checked').value;

    filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
            product.brand.toLowerCase().includes(searchTerm);

        const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand) || selectedBrands.includes(product.material);

        let matchesPrice = true;
        if (selectedPrice !== 'all') {
            const [min, max] = selectedPrice.split('-').map(p => p.replace('+', ''));
            if (max) {
                matchesPrice = product.price >= parseInt(min) && product.price <= parseInt(max);
            } else {
                matchesPrice = product.price >= parseInt(min);
            }
        }

        return matchesSearch && matchesBrand && matchesPrice;
    });

    renderProducts();
}

// Sort products
function sortProducts() {
    const sortBy = sortSelect.value;

    switch (sortBy) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'rating':
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
        default:
            filteredProducts = [...products];
    }

    renderProducts();
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);

    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Setup event listeners
function setupEventListeners() {
    cartToggle.addEventListener('click', () => {
        cartSidebar.classList.toggle('translate-x-full');
    });

    closeCart.addEventListener('click', () => {
        cartSidebar.classList.add('translate-x-full');
    });

    closeModal.addEventListener('click', closeProductModal);
    productModal.addEventListener('click', (e) => {
        if (e.target === productModal) closeProductModal();
    });

    searchInput.addEventListener('input', filterProducts);
    sortSelect.addEventListener('change', sortProducts);

    document.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach(input => {
        input.addEventListener('change', filterProducts);
    });

    clearFilters.addEventListener('click', () => {
        searchInput.value = '';
        document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
        document.querySelector('input[name="price"][value="all"]').checked = true;
        filteredProducts = [...products];
        renderProducts();
    });

    document.getElementById('grid-view').addEventListener('click', function () {
        this.classList.add('bg-orange-500', 'text-white');
        this.classList.remove('bg-gray-200', 'text-gray-600');
        document.getElementById('list-view').classList.add('bg-gray-200', 'text-gray-600');
        document.getElementById('list-view').classList.remove('bg-orange-500', 'text-white');
        productsContainer.className = 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6';
    });

    document.getElementById('list-view').addEventListener('click', function () {
        this.classList.add('bg-orange-500', 'text-white');
        this.classList.remove('bg-gray-200', 'text-gray-600');
        document.getElementById('grid-view').classList.add('bg-gray-200', 'text-gray-600');
        document.getElementById('grid-view').classList.remove('bg-orange-500', 'text-white');
        productsContainer.className = 'grid grid-cols-1 gap-6';
    });
}
