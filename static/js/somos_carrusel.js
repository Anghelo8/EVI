document.addEventListener('DOMContentLoaded', () => {
    // ===============================================
    // Lógica del Carrusel de Imágenes (Quiénes Somos)
    // ===============================================
    const carouselItems = document.querySelectorAll('#carousel .carousel-item');
    const prevButton = document.getElementById('prev');
    const nextButton = document.getElementById('next');
    let currentImageIndex = 0;

    function showImage(index) {
        carouselItems.forEach((item, i) => {
            if (i === index) {
                item.classList.remove('opacity-0');
                item.classList.add('opacity-100');
            } else {
                item.classList.remove('opacity-100');
                item.classList.add('opacity-0');
            }
        });
    }

    function nextImage() {
        currentImageIndex = (currentImageIndex + 1) % carouselItems.length;
        showImage(currentImageIndex);
    }

    function prevImage() {
        currentImageIndex = (currentImageIndex - 1 + carouselItems.length) % carouselItems.length;
        showImage(currentImageIndex);
    }

    if (prevButton && nextButton) {
        prevButton.addEventListener('click', prevImage);
        nextButton.addEventListener('click', nextImage);
    }

    // Auto-avance del carrusel
    setInterval(nextImage, 5000); // Cambia la imagen cada 5 segundos

    // ===============================================
    // Lógica del Carrusel de Reseñas
    // ===============================================
    const reviewsCarousel = document.getElementById('reviews-carousel');
    const prevReviewBtn = document.getElementById('prevReviewBtn');
    const nextReviewBtn = document.getElementById('nextReviewBtn');
    const reviewCards = document.querySelectorAll('.review-card');
    let currentReviewIndex = 0;

    // Función para obtener el número de tarjetas visibles
    function getVisibleCardsCount() {
        if (window.innerWidth >= 1024) { // lg screens
            return 3;
        } else if (window.innerWidth >= 768) { // md screens
            return 2;
        } else { // sm and smaller screens
            return 1;
        }
    }

    function updateReviewsCarousel() {
        const visibleCards = getVisibleCardsCount();
        // Asegúrate de que reviewsCarousel.querySelector('.review-card') no sea null
        const firstReviewCard = reviewsCarousel ? reviewsCarousel.querySelector('.review-card') : null;
        const cardWidth = firstReviewCard ? firstReviewCard.offsetWidth : 0;
        const gap = parseInt(window.getComputedStyle(reviewsCarousel).getPropertyValue('gap')) || 0; // Obtener el gap CSS
        const totalCardWidth = cardWidth + gap; // Ancho de la tarjeta más el gap
        const offset = currentReviewIndex * totalCardWidth;
        if (reviewsCarousel) {
            reviewsCarousel.style.transform = `translateX(-${offset}px)`;
        }


        // Control de visibilidad de botones
        if (prevReviewBtn) {
            prevReviewBtn.disabled = currentReviewIndex === 0;
        }
        if (nextReviewBtn) {
            nextReviewBtn.disabled = currentReviewIndex >= reviewCards.length - visibleCards;
        }
    }

    // Inicializar carrusel de reseñas
    if (reviewsCarousel && reviewCards.length > 0) {
        updateReviewsCarousel(); // Establece la posición inicial y el estado de los botones
        window.addEventListener('resize', updateReviewsCarousel); // Re-renderiza al cambiar tamaño de ventana
    }

    if (prevReviewBtn) {
        prevReviewBtn.addEventListener('click', () => {
            const visibleCards = getVisibleCardsCount();
            currentReviewIndex = Math.max(0, currentReviewIndex - visibleCards);
            updateReviewsCarousel();
        });
    }

    if (nextReviewBtn) {
        nextReviewIndex = () => {
            const visibleCards = getVisibleCardsCount();
            currentReviewIndex = Math.min(reviewCards.length - visibleCards, currentReviewIndex + visibleCards);
            updateReviewsCarousel();
        };
        nextReviewBtn.addEventListener('click', nextReviewIndex);
    }


    // ===============================================
    // Animación para el header de reseñas
    // ===============================================
    const reviewsHeader = document.getElementById('reviews-header');
    const globalRatingStars = document.getElementById('global-rating-stars');

    const observerOptionsReviewsHeader = { // Renombrado para evitar conflicto
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observerReviewsHeader = new IntersectionObserver((entries, observer) => { // Renombrado
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (reviewsHeader) {
                    reviewsHeader.classList.remove('opacity-0', 'translate-y-10');
                    reviewsHeader.classList.add('opacity-100', 'translate-y-0');
                }
                if (globalRatingStars) {
                    globalRatingStars.classList.remove('opacity-0', 'scale-75');
                    globalRatingStars.classList.add('opacity-100', 'scale-100');
                }
                observer.unobserve(entry.target); // Deja de observar una vez que se activa la animación
            }
        });
    }, observerOptionsReviewsHeader); // Usar el nuevo nombre

    if (reviewsHeader) {
        observerReviewsHeader.observe(reviewsHeader); // Usar el nuevo nombre
    }

    // ===============================================
    // Lógica del Carrito de Compras (asumiendo que viene de otra página)
    // ===============================================
    const cartToggle = document.getElementById('cart-toggle');
    const cartPanel = document.getElementById('cart-panel');
    const cartCount = document.getElementById('cart-count');
    const cartContainer = document.getElementById('cart'); // El div que contiene los ítems del carrito

    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    // Función para renderizar el carrito
    function renderCart() {
        if (cartContainer) {
            cartContainer.innerHTML = ''; // Limpiar el contenido actual del carrito
            if (cartItems.length === 0) {
                cartContainer.innerHTML = '<p class="text-gray-600 text-lg">No hay productos en el carrito.</p>';
            } else {
                cartItems.forEach(item => {
                    const cartItemDiv = document.createElement('div');
                    cartItemDiv.classList.add('flex', 'items-center', 'space-x-3', 'py-2', 'border-b', 'border-gray-200');
                    cartItemDiv.innerHTML = `
                        <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded-md" />
                        <div class="flex-1 min-w-0">
                            <h4 class="text-black text-sm font-medium truncate">${item.name}</h4>
                            <p class="text-orange-500 text-sm font-bold">$${item.price.toFixed(2)}</p>
                        </div>
                        <button class="remove-from-cart text-red-600 hover:text-red-700 transition p-1" data-id="${item.id}">
                            <i class="fas fa-trash text-sm"></i>
                        </button>
                    `;
                    cartContainer.appendChild(cartItemDiv);
                });
            }
        }
        if (cartCount) {
            cartCount.textContent = cartItems.length;
        }
        localStorage.setItem('cartItems', JSON.stringify(cartItems)); // Guardar en localStorage
    }

    // Añadir/Remover ítems del carrito (ejemplo de cómo se añadiría, esta página no tiene botones de añadir)
    // Puedes tener una función global o en otra página que llame a addToCart
    // function addToCart(product) {
    //     cartItems.push(product);
    //     renderCart();
    // }

    function removeFromCart(productId) {
        cartItems = cartItems.filter(item => item.id !== productId);
        renderCart();
    }

    // Manejar clics en el botón de toggle del carrito
    if (cartToggle) {
        cartToggle.addEventListener('click', () => {
            if (cartPanel) {
                cartPanel.classList.toggle('hidden');
            }
        });
    }

    // Manejar clics para remover del carrito
    if (cartContainer) {
        cartContainer.addEventListener('click', (event) => {
            if (event.target.closest('.remove-from-cart')) {
                const button = event.target.closest('.remove-from-cart');
                const productId = button.dataset.id;
                removeFromCart(productId);
            }
        });
    }

    // Inicializar el carrito al cargar la página
    renderCart();

    // ===============================================
    // Lógica del Modal de Reseñas
    // ===============================================
    const leaveReviewBtn = document.getElementById('leave-review-btn');
    const reviewModal = document.getElementById('review-modal');
    const closeReviewModal = document.getElementById('close-review-modal');
    const reviewForm = document.getElementById('review-form');
    const ratingStarsInput = document.getElementById('rating-stars-input');
    const selectedRatingInput = document.getElementById('selected-rating');

    // Mostrar modal
    if (leaveReviewBtn) {
        leaveReviewBtn.addEventListener('click', () => {
            if (reviewModal) {
                reviewModal.classList.remove('hidden');
            }
        });
    }

    // Cerrar modal
    if (closeReviewModal) {
        closeReviewModal.addEventListener('click', () => {
            if (reviewModal) {
                reviewModal.classList.add('hidden');
            }
        });
    }

    // Cerrar modal si se hace clic fuera de él
    if (reviewModal) {
        reviewModal.addEventListener('click', (e) => {
            if (e.target === reviewModal) {
                reviewModal.classList.add('hidden');
            }
        });
    }

    // Funcionalidad de calificación por estrellas
    if (ratingStarsInput) {
        ratingStarsInput.addEventListener('click', (e) => {
            const clickedStar = e.target.closest('i');
            if (clickedStar) {
                const rating = parseInt(clickedStar.dataset.rating);
                if (selectedRatingInput) {
                    selectedRatingInput.value = rating;
                }

                // Actualizar estrellas visualmente
                ratingStarsInput.querySelectorAll('i').forEach((star, index) => {
                    if (index < rating) {
                        star.classList.remove('far');
                        star.classList.add('fas');
                    } else {
                        star.classList.remove('fas');
                        star.classList.add('far');
                    }
                });
            }
        });
    }

    // Manejar envío del formulario de reseña
    if (reviewForm) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const reviewerName = document.getElementById('reviewer-name') ? document.getElementById('reviewer-name').value : '';
            const reviewText = document.getElementById('review-text') ? document.getElementById('review-text').value : '';
            const rating = selectedRatingInput ? parseInt(selectedRatingInput.value) : 0;

            if (reviewerName && reviewText && rating > 0) {
                // Aquí puedes añadir lógica para enviar la reseña a un servidor
                // o para añadirla dinámicamente al carrusel (esto es más complejo y requeriría una estructura de datos para las reseñas)
                console.log('Reseña enviada:', { reviewerName, reviewText, rating });

                // Resetear formulario y cerrar modal
                reviewForm.reset();
                if (selectedRatingInput) {
                    selectedRatingInput.value = '0';
                }
                if (ratingStarsInput) {
                    ratingStarsInput.querySelectorAll('i').forEach(star => {
                        star.classList.remove('fas');
                        star.classList.add('far');
                    });
                }
                if (reviewModal) {
                    reviewModal.classList.add('hidden');
                }

                alert('¡Gracias por tu reseña!');
            } else {
                alert('Por favor, completa todos los campos y selecciona una calificación.');
            }
        });
    }

    // ===============================================
    // Lógica para animar elementos al hacer scroll
    // ===============================================
    const animateOnScrollElements = document.querySelectorAll('[data-animate-on-scroll]');

    const scrollObserverOptions = {
        root: null, // Usa el viewport como root
        rootMargin: '0px',
        threshold: 0.5 // El 50% del elemento debe ser visible para disparar la animación
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.animationDelay ? parseInt(entry.target.dataset.animationDelay) : 0;
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, delay);
                observer.unobserve(entry.target); // Dejar de observar una vez que se anima
            }
        });
    }, scrollObserverOptions);

    // Observar todos los elementos con el atributo data-animate-on-scroll
    animateOnScrollElements.forEach(element => {
        scrollObserver.observe(element);
    });
});