
// Funcionalidad del carrito
let carrito = [];
const btnCarrito = document.getElementById('btnCarrito');
const carritoElement = document.getElementById('carrito');
const itemsCarrito = document.getElementById('itemsCarrito');
const totalCarrito = document.getElementById('totalCarrito');
const contadorCarrito = document.getElementById('contadorCarrito');

// Mostrar/ocultar carrito
btnCarrito.addEventListener('click', () => {
    carritoElement.classList.toggle('hidden');
});

// Agregar al carrito
document.querySelectorAll('.agregar-carrito').forEach(button => {
    button.addEventListener('click', () => {
        const id = button.dataset.id;
        const nombre = button.dataset.nombre;
        const precio = parseFloat(button.dataset.precio);

        const item = carrito.find(item => item.id === id);
        if (item) {
            item.cantidad++;
        } else {
            carrito.push({ id, nombre, precio, cantidad: 1 });
        }

        actualizarCarrito();
        carritoElement.classList.remove('hidden');
    });
});

// Actualizar carrito
function actualizarCarrito() {
    itemsCarrito.innerHTML = '';
    let total = 0;
    let contador = 0;

    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        contador += item.cantidad;

        itemsCarrito.innerHTML += `
                    <div class="flex justify-between items-center">
                        <div>
                            <h4 class="font-semibold text-purple-900">${item.nombre}</h4>
                            <p class="text-sm text-gray-600">$${item.precio} x ${item.cantidad}</p>
                        </div>
                        <div class="flex items-center space-x-2">
                            <button class="text-purple-600 hover:text-purple-700" onclick="actualizarCantidad('${item.id}', ${item.cantidad - 1})">-</button>
                            <span class="text-purple-900">${item.cantidad}</span>
                            <button class="text-purple-600 hover:text-purple-700" onclick="actualizarCantidad('${item.id}', ${item.cantidad + 1})">+</button>
                        </div>
                    </div>
                `;
    });

    totalCarrito.textContent = `$${total.toFixed(2)}`;
    contadorCarrito.textContent = contador;
}

// Actualizar cantidad
function actualizarCantidad(id, nuevaCantidad) {
    if (nuevaCantidad <= 0) {
        carrito = carrito.filter(item => item.id !== id);
    } else {
        const item = carrito.find(item => item.id === id);
        if (item) {
            item.cantidad = nuevaCantidad;
        }
    }
    actualizarCarrito();
}

// Botón comprar
document.getElementById('btnComprar').addEventListener('click', () => {
    if (carrito.length === 0) {
        alert('El carrito está vacío');
        return;
    }
    alert('¡Gracias por tu compra!');
    carrito = [];
    actualizarCarrito();
    carritoElement.classList.add('hidden');
});
