
        // Variables globales
        let currentSlide = 0;
        let currentReview = 0;
        let cartCount = 0;
        let isChatOpen = false;
        let messages = [
            {
                id: 1,
                text: "¡Hola! Soy el asistente virtual de Josesito Enterprise. ¿En qué puedo ayudarte hoy?",
                isBot: true,
                timestamp: new Date()
            }
        ];
        let isTyping = false;

        // Respuestas automáticas del chatbot
        const botResponses = {
            'hola': '¡Hola! ¿En qué puedo ayudarte con tus necesidades automotrices?',
            'horario': 'Nuestro horario es de Lunes a Sábado de 8:00 AM a 6:00 PM. Los domingos estamos cerrados.',
            'ubicacion': 'Nos encontramos en [Dirección]. Puedes visitarnos o llamarnos al +51 999 888 777.',
            'servicios': 'Ofrecemos: Parchado de llantas, Venta de llantas y rines, Alineación y balanceo, Productos de limpieza automotriz, y Accesorios para autos.',
            'precios': 'Nuestros precios son muy competitivos. ¿Qué servicio específico te interesa? Te puedo dar más detalles.',
            'llantas': 'Tenemos una gran variedad de llantas para autos, motos y bicicletas. ¿Qué tipo de vehículo tienes?',
            'parchado': 'Nuestro servicio de parchado es rápido y confiable. Generalmente toma entre 15-30 minutos dependiendo del daño.',
            'default': 'Gracias por tu consulta. Para información más específica, puedes llamarnos al +51 999 888 777 o visitarnos en nuestra ubicación.'
        };

        // Inicialización cuando se carga la página
        document.addEventListener('DOMContentLoaded', function() {
            initializeCarousel();
            initializeCart();
            initializeChatbot();
            initializeReviews();
            initializeAnimations();
        });

        // Inicializar carrusel
        function initializeCarousel() {
            const carouselImages = document.querySelectorAll('.carousel-item');
            const prevBtn = document.getElementById('prev');
            const nextBtn = document.getElementById('next');

            // Carrusel automático
            setInterval(() => {
                nextSlide();
            }, 4000);

            prevBtn.addEventListener('click', prevSlide);
            nextBtn.addEventListener('click', nextSlide);

            function nextSlide() {
                carouselImages[currentSlide].style.opacity = '0';
                currentSlide = (currentSlide + 1) % carouselImages.length;
                carouselImages[currentSlide].style.opacity = '1';
            }

            function prevSlide() {
                carouselImages[currentSlide].style.opacity = '0';
                currentSlide = (currentSlide - 1 + carouselImages.length) % carouselImages.length;
                carouselImages[currentSlide].style.opacity = '1';
            }
        }

        // Inicializar carrito
        function initializeCart() {
            const cartToggle = document.getElementById('cart-toggle');
            const cartPanel = document.getElementById('cart-panel');

            cartToggle.addEventListener('click', () => {
                cartPanel.classList.toggle('hidden');
            });
        }

        // Inicializar chatbot
        function initializeChatbot() {
            const chatToggle = document.getElementById('chat-toggle');
            const chatPanel = document.getElementById('chat-panel');
            const chatIcon = document.getElementById('chat-icon');
            const chatInput = document.getElementById('chat-input');
            const sendButton = document.getElementById('send-message');

            chatToggle.addEventListener('click', toggleChat);
            sendButton.addEventListener('click', sendMessage);
            chatInput.addEventListener('keypress', handleKeyPress);

            function toggleChat() {
                isChatOpen = !isChatOpen;
                
                if (isChatOpen) {
                    chatPanel.classList.remove('opacity-0', 'translate-y-4', 'pointer-events-none');
                    chatPanel.classList.add('opacity-100', 'translate-y-0');
                    chatIcon.className = 'fas fa-times text-2xl';
                } else {
                    chatPanel.classList.add('opacity-0', 'translate-y-4', 'pointer-events-none');
                    chatPanel.classList.remove('opacity-100', 'translate-y-0');
                    chatIcon.className = 'fas fa-comments text-2xl';
                }
            }

            function sendMessage() {
                const inputValue = chatInput.value.trim();
                if (!inputValue) return;

                // Agregar mensaje del usuario
                addMessage(inputValue, false);
                chatInput.value = '';

                // Mostrar indicador de escritura
                showTypingIndicator();

                // Simular respuesta del bot
                setTimeout(() => {
                    hideTypingIndicator();
                    const response = getBotResponse(inputValue);
                    addMessage(response, true);
                }, 1500);
            }

            function handleKeyPress(e) {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                }
            }

            function addMessage(text, isBot) {
                const messagesContainer = document.getElementById('chat-messages');
                const messageDiv = document.createElement('div');
                messageDiv.className = `flex ${isBot ? 'justify-start' : 'justify-end'} chat-message`;
                
                messageDiv.innerHTML = `
                    <div class="max-w-xs px-3 py-2 rounded-lg text-sm ${isBot ? 'bg-gray-100 text-gray-800' : 'bg-orange-500 text-white'}">
                        ${text}
                    </div>
                `;
                
                messagesContainer.appendChild(messageDiv);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }

            function showTypingIndicator() {
                const messagesContainer = document.getElementById('chat-messages');
                const typingDiv = document.createElement('div');
                typingDiv.id = 'typing-indicator';
                typingDiv.className = 'flex justify-start';
                
                typingDiv.innerHTML = `
                    <div class="bg-gray-100 text-gray-800 px-3 py-2 rounded-lg text-sm">
                        <div class="flex space-x-1">
                            <div class="typing-dot"></div>
                            <div class="typing-dot"></div>
                            <div class="typing-dot"></div>
                        </div>
                    </div>
                `;
                
                messagesContainer.appendChild(typingDiv);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }

            function hideTypingIndicator() {
                const typingIndicator = document.getElementById('typing-indicator');
                if (typingIndicator) {
                    typingIndicator.remove();
                }
            }

            function getBotResponse(input) {
                const lowerInput = input.toLowerCase();
                
                for (const [key, value] of Object.entries(botResponses)) {
                    if (lowerInput.includes(key)) {
                        return value;
                    }
                }
                
                return botResponses.default;
            }
        }

        // Inicializar reseñas
        function initializeReviews() {
            const leaveReviewBtn = document.getElementById('leave-review-btn');
            const reviewModal = document.getElementById('review-modal');
            const closeModalBtn = document.getElementById('close-review-modal');
            const reviewForm = document.getElementById('review-form');
            const ratingStars = document.querySelectorAll('#rating-stars-input i');
            const selectedRating = document.getElementById('selected-rating');

            leaveReviewBtn.addEventListener('click', () => {
                reviewModal.classList.remove('hidden');
            });

            closeModalBtn.addEventListener('click', () => {
                reviewModal.classList.add('hidden');
            });

            // Rating stars functionality
            ratingStars.forEach((star, index) => {
                star.addEventListener('click', () => {
                    const rating = index + 1;
                    selectedRating.value = rating;
                    
                    ratingStars.forEach((s, i) => {
                        if (i < rating) {
                            s.className = 'fas fa-star text-yellow-400 cursor-pointer';
                        } else {
                            s.className = 'far fa-star text-yellow-400 cursor-pointer';
                        }
                    });
                });
            });

            reviewForm.addEventListener('submit', (e) => {
                e.preventDefault();
                alert('¡Gracias por tu reseña! Será revisada y publicada pronto.');
                reviewModal.classList.add('hidden');
                reviewForm.reset();
                ratingStars.forEach(star => {
                    star.className = 'far fa-star text-yellow-400 cursor-pointer';
                });
                selectedRating.value = '0';
            });
        }

        // Inicializar animaciones
        function initializeAnimations() {
            const reviewsHeader = document.getElementById('reviews-header');
            const globalRatingStars = document.getElementById('global-rating-stars');

            // Intersection Observer para animaciones
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        if (entry.target === reviewsHeader) {
                            reviewsHeader.classList.remove('opacity-0', 'translate-y-10');
                            reviewsHeader.classList.add('opacity-100', 'translate-y-0');
                            
                            setTimeout(() => {
                                globalRatingStars.classList.remove('opacity-0', 'scale-75');
                                globalRatingStars.classList.add('opacity-100', 'scale-100');
                            }, 300);
                        }
                    }
                });
            });

            observer.observe(reviewsHeader);
        }