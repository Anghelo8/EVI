document.addEventListener("DOMContentLoaded", () => {
    const tarjetasSection = document.getElementById("tarjetas-section");
    const formularioTarjeta = document.getElementById("formulario-tarjeta");
    const mensaje = document.getElementById("mensaje");
    const paymentForm = document.getElementById("payment-form");
    const expiryDateInput = document.getElementById("expiry-date");
    const cardNumberInput = document.getElementById("card-number");
    const cvvInput = document.getElementById("cvv");
    const paymentMethodSelect = document.getElementById("payment-method");
    const cardIdInput = document.getElementById("card-id");
    const submitButton = document.getElementById("submit-button");
    const cancelEditButton = document.getElementById("cancel-edit-button");

    const paymentSuccessOverlay = document.getElementById("payment-success-overlay");
    const closeOverlayBtn = document.getElementById("close-overlay-btn");

    // Nuevo elemento para el botón de pago
    const paymentActionsSection = document.getElementById("payment-actions-section");
    const proceedPaymentBtn = document.getElementById('proceed-payment-btn');

    let selectedCardId = null; // Variable para almacenar el ID de la tarjeta seleccionada

    // --- Funciones de animación ---
    const animateInElement = (element, duration = "duration-500", translateY = "translate-y-8") => {
        element.style.display = "block";
        setTimeout(() => {
            element.classList.add("transition-opacity", "transition-transform", duration, "ease-out");
            element.classList.remove("opacity-0", translateY, "pointer-events-none");
            element.classList.add("opacity-100", "translate-y-0", "pointer-events-auto");
        }, 10);
    };

    const animateOutElement = (element, duration = "duration-400", translateY = "translate-y-4") => {
        element.classList.add("transition-opacity", "transition-transform", duration, "ease-out");
        element.classList.remove("opacity-100", "translate-y-0", "pointer-events-auto");
        element.classList.add("opacity-0", translateY, "pointer-events-none");

        element.addEventListener('transitionend', function handler() {
            element.style.display = "none";
            element.classList.remove("transition-opacity", "transition-transform", duration, "ease-out");
            this.removeEventListener('transitionend', handler);
        }, { once: true });
    };

    // --- Funciones de Overlay de Pago Exitoso ---
    const showSuccessOverlay = () => {
        paymentSuccessOverlay.style.display = "flex"; // Usar flex para centrar
        document.body.classList.add('overflow-hidden'); // Deshabilitar scroll del body
        setTimeout(() => {
            paymentSuccessOverlay.classList.remove("opacity-0");
            // Animar el contenido del modal
            paymentSuccessOverlay.querySelector('div').classList.remove("-translate-y-10", "opacity-0");
            paymentSuccessOverlay.querySelector('div').classList.add("translate-y-0", "opacity-100");
        }, 10);
    };

    const hideSuccessOverlay = () => {
        // Animar el contenido del modal hacia afuera
        paymentSuccessOverlay.querySelector('div').classList.remove("translate-y-0", "opacity-100");
        paymentSuccessOverlay.querySelector('div').classList.add("-translate-y-10", "opacity-0");

        setTimeout(() => {
            paymentSuccessOverlay.classList.add("opacity-0");
            paymentSuccessOverlay.addEventListener('transitionend', function handler() {
                // Una vez que la transición del overlay principal termina
                paymentSuccessOverlay.style.display = "hidden"; // Ocultar el overlay completamente
                document.body.classList.remove('overflow-hidden'); // Habilitar scroll
                this.removeEventListener('transitionend', handler);

                // --- Redirigir al index.html después de ocultar el overlay ---
                window.location.href = "/";
                // --- FIN Redirección ---

            }, { once: true });
        }, 300); // Duración de la transición del modal interno
    };

    closeOverlayBtn.addEventListener('click', () => {
        hideSuccessOverlay();
        // Ya no necesitamos loadCards() aquí porque redirigimos.
    });


    // --- Lógica de Formateo y Validación de Fecha de Expiración ---
    cardNumberInput.addEventListener('input', (e) => {
        let input = e.target.value.replace(/\D/g, ''); // Eliminar no dígitos
        // Opcional: Formatear para mostrar espacios cada 4 dígitos
        e.target.value = input.replace(/(.{4})/g, '$1 ').trim();
    });

    expiryDateInput.addEventListener('input', (e) => {
        let input = e.target.value.replace(/\D/g, '');
        let formattedInput = '';

        if (input.length > 0) {
            formattedInput = input.substring(0, 2);
            if (input.length >= 3) {
                formattedInput += '/' + input.substring(2, 4);
            }
        }
        e.target.value = formattedInput;
    });

    cvvInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '').substring(0, 4); // Solo dígitos, máximo 4
    });

    // --- Funciones de CRUD (Eliminar y Editar) ---
    const handleDeleteCard = (cardId) => {
        console.log("Intentando eliminar tarjeta con ID:", cardId);

        if (!confirm("¿Estás seguro de que quieres eliminar esta tarjeta?")) {
            return;
        }

        fetch(`/eliminar_tarjeta/${cardId}`, {
            method: "DELETE",
        })
        .then(res => {
            console.log("Respuesta de DELETE:", res);
            if (!res.ok) {
                return res.json().then(err => Promise.reject(err));
            }
            return res.json();
        })
        .then(data => {
            mensaje.innerHTML = `<p class="text-white bg-green-500 p-3 rounded-lg shadow-md">${data.message}</p>`;
            animateInElement(mensaje, "duration-400", "translate-y-4");
            setTimeout(() => {
                animateOutElement(mensaje, "duration-400", "translate-y-4");
                setTimeout(() => loadCards(), 500); // Recargar tarjetas después de eliminar
            }, 2000);
        })
        .catch(err => {
            console.error("Error al eliminar la tarjeta:", err);
            mensaje.innerHTML = `<p class="text-white bg-red-500 p-3 rounded-lg shadow-md">${err.error || "Error al eliminar la tarjeta"}</p>`;
            animateInElement(mensaje, "duration-400", "translate-y-4");
            setTimeout(() => {
                animateOutElement(mensaje, "duration-400", "translate-y-4");
            }, 3000);
        });
    };

    const enterEditMode = (card) => {
        cardIdInput.value = card[0]; // ID
        paymentMethodSelect.value = card[1]; // Tipo de tarjeta
        cardNumberInput.value = card[2]; // Últimos 4 dígitos (mostrar para que el usuario sepa qué editar)
        expiryDateInput.value = card[3]; // MM/YY
        cvvInput.value = card[4]; // CVV

        submitButton.textContent = "Actualizar Tarjeta";
        submitButton.classList.remove("bg-orange-600", "hover:bg-orange-700");
        submitButton.classList.add("bg-blue-600", "hover:bg-blue-700");
        cancelEditButton.classList.remove("hidden");
        paymentForm.classList.add('border-blue-500', 'border-2');

        animateInElement(formularioTarjeta, "duration-500", "translate-y-8");
        window.scrollTo({ top: formularioTarjeta.offsetTop, behavior: 'smooth' });
    };

    const exitEditMode = () => {
        paymentForm.reset();
        cardIdInput.value = "";
        submitButton.textContent = "Registrar Tarjeta";
        submitButton.classList.remove("bg-blue-600", "hover:bg-blue-700");
        submitButton.classList.add("bg-orange-600");
        cancelEditButton.classList.add("hidden");
        paymentForm.classList.remove('border-blue-500', 'border-2');
        selectedCardId = null; // Deseleccionar cualquier tarjeta al salir del modo edición
        // Ocultar el botón de pago
        paymentActionsSection.classList.add('hidden', 'opacity-0');
    };

    cancelEditButton.addEventListener('click', exitEditMode);

    // --- Lógica para seleccionar una tarjeta (NUEVA) ---
    const selectCard = (cardElement, cardId) => {
        // Remover la clase 'selected' de todas las tarjetas
        document.querySelectorAll('.card-item').forEach(card => {
            card.classList.remove('border-green-500', 'border-4');
            card.classList.add('border-gray-300', 'border-2'); // Restaurar borde normal
        });

        // Añadir la clase 'selected' a la tarjeta clickeada
        cardElement.classList.add('border-green-500', 'border-4');
        cardElement.classList.remove('border-gray-300', 'border-2'); // Remover borde normal

        selectedCardId = cardId; // Almacenar el ID de la tarjeta seleccionada
        
        // Mostrar el botón de pago si está oculto
        if (paymentActionsSection.classList.contains('hidden')) {
            animateInElement(paymentActionsSection, "duration-300", "translate-y-4");
        }
    };

    // --- Lógica principal de la aplicación (Modificada para selección visual) ---
    const loadCards = () => {
        fetch("/obtener_pagos")
            .then((res) => res.json())
            .then((tarjetas) => {
                exitEditMode(); // Asegura que el formulario esté en modo de registro al cargar las tarjetas
                selectedCardId = null; // Resetear la tarjeta seleccionada al recargar
                paymentActionsSection.classList.add('hidden', 'opacity-0'); // Ocultar el botón de pago al recargar

                if (tarjetas.length === 0) {
                    tarjetasSection.innerHTML = `<p class="text-gray-700 font-medium">No tienes tarjetas registradas. Puedes agregar una.</p>`;
                    animateInElement(formularioTarjeta, "duration-500", "translate-y-8");
                    
                } else {
                    let tarjetasHtml = `
                        <h2 class="text-xl font-semibold text-gray-800 mb-4">Tus Tarjetas Registradas:</h2>
                        <div class="space-y-4 mb-6">
                    `;
                    tarjetas.forEach(t => {
                        tarjetasHtml += `
                            <div data-card-id="${t[0]}"
                                class="card-item flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-sm border-2 border-gray-300 cursor-pointer hover:bg-gray-200 transition duration-150 ease-in-out">
                                <span class="text-gray-800 font-medium">
                                    ${t[1]} **** ${t[2]} (Exp: ${t[3]})
                                </span>
                                <div class="flex space-x-2">
                                    <button data-card='${JSON.stringify(t)}'
                                            class="edit-card-btn bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full text-sm w-8 h-8 flex items-center justify-center transition duration-150 ease-in-out"
                                            title="Editar Tarjeta">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button data-card-id="${t[0]}"
                                            class="delete-card-btn bg-red-500 hover:bg-red-600 text-white p-2 rounded-full text-sm w-8 h-8 flex items-center justify-center transition duration-150 ease-in-out"
                                            title="Eliminar Tarjeta">
                                        <i class="fas fa-trash-alt"></i>
                                    </button>
                                </div>
                            </div>
                        `;
                    });
                    tarjetasHtml += `</div>`;

                    tarjetasSection.innerHTML = tarjetasHtml;

                    // Adjuntar listeners DESPUÉS de que el DOM se haya actualizado
                    document.querySelectorAll('.delete-card-btn').forEach(button => {
                        button.addEventListener('click', (e) => {
                            // Detener la propagación para que no se active el click de la tarjeta
                            e.stopPropagation();
                            const cardId = e.currentTarget.dataset.cardId;
                            handleDeleteCard(cardId);
                        });
                    });

                    document.querySelectorAll('.edit-card-btn').forEach(button => {
                        button.addEventListener('click', (e) => {
                            // Detener la propagación para que no se active el click de la tarjeta
                            e.stopPropagation();
                            const cardData = JSON.parse(e.currentTarget.dataset.card);
                            enterEditMode(cardData);
                        });
                    });

                    // NUEVO: Listener para la selección de tarjeta individual
                    document.querySelectorAll('.card-item').forEach(cardElement => {
                        cardElement.addEventListener('click', (e) => {
                            const cardId = e.currentTarget.dataset.cardId;
                            selectCard(e.currentTarget, cardId);
                        });
                    });


                    const addNewCardBtn = document.getElementById('add-new-card-btn');
                    // Solo añadir el botón de "Registrar otra tarjeta" si hay menos de 2
                    if (tarjetas.length < 2) {
                        if (!addNewCardBtn) { // Prevenir añadir duplicados si ya existe
                            const newButtonHtml = `
                                <button id="add-new-card-btn" class="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-75 transition duration-150 ease-in-out">
                                    Registrar otra tarjeta
                                </button>
                            `;
                            tarjetasSection.insertAdjacentHTML('beforeend', newButtonHtml);
                            document.getElementById('add-new-card-btn').addEventListener('click', () => {
                                exitEditMode();
                                animateInElement(formularioTarjeta, "duration-500", "translate-y-8");
                            });
                        }
                    } else if (addNewCardBtn) { // Si hay 2 tarjetas, asegurar que el botón de añadir se elimine
                        addNewCardBtn.remove();
                    }
                    
                    // Listener para el botón "Proceder al Pago"
                    if (proceedPaymentBtn) { // Asegurarse de que el botón exista
                        // Remover el listener anterior para evitar duplicados al recargar tarjetas
                        proceedPaymentBtn.removeEventListener('click', handleProceedPayment); 
                        proceedPaymentBtn.addEventListener('click', handleProceedPayment);
                    }

                    if (tarjetas.length >= 2) {
                        // Si hay 2 tarjetas, ocultar el formulario de añadir/editar
                        formularioTarjeta.style.display = "none";
                        mensaje.innerHTML = `<p class="text-white bg-red-500 p-3 rounded-lg shadow-md">Tienes 2 tarjetas registradas. Elimina una para agregar otra.</p>`;
                        animateInElement(mensaje, "duration-400", "translate-y-4");
                    } else {
                        // Si hay menos de 2 tarjetas y no estamos en modo edición, mostrar el formulario
                        if (cardIdInput.value === "" && formularioTarjeta.style.display === "none") {
                            animateInElement(formularioTarjeta, "duration-500", "translate-y-8");
                        }
                    }
                }
            })
            .catch((error) => {
                console.error("Error al obtener las tarjetas:", error);
                tarjetasSection.innerHTML = `<p class="text-red-500 font-semibold">Error al cargar las tarjetas. Inténtalo de nuevo más tarde.</p>`;
                animateInElement(formularioTarjeta, "duration-500", "translate-y-8");
                paymentActionsSection.classList.add('hidden', 'opacity-0'); // Ocultar si hay error
            });
    };

    // Función para manejar el clic en "Proceder al Pago"
    const handleProceedPayment = () => {
        if (selectedCardId) {
            console.log("Tarjeta seleccionada para pago:", selectedCardId);
            // Aquí puedes enviar el selectedCardId a tu backend
            // para procesar el pago real.
            showSuccessOverlay();
        } else {
            mensaje.innerHTML = `<p class="text-white bg-red-500 p-3 rounded-lg shadow-md">Por favor, selecciona una tarjeta para proceder con el pago.</p>`;
            animateInElement(mensaje, "duration-400", "translate-y-4");
            setTimeout(() => animateOutElement(mensaje, "duration-400", "translate-y-4"), 3000);
        }
    };


    loadCards(); // Cargar las tarjetas al iniciar la página

    // --- Envío del Formulario (Registro/Actualización) ---
    paymentForm.addEventListener("submit", (e) => {
        e.preventDefault();

        // Validaciones de formulario (mantener tal cual)
        const expiryDateValue = expiryDateInput.value;
        const [monthStr, yearStr] = expiryDateValue.split('/');
        if (!monthStr || !yearStr || expiryDateValue.length !== 5) {
            mensaje.innerHTML = `<p class="text-white bg-red-500 p-3 rounded-lg shadow-md">Por favor, introduce la fecha de expiración en formato MM/AA.</p>`;
            animateInElement(mensaje, "duration-400", "translate-y-4");
            setTimeout(() => animateOutElement(mensaje, "duration-400", "translate-y-4"), 3000);
            return;
        }
        const month = parseInt(monthStr, 10);
        const year = parseInt(yearStr, 10);
        if (month < 1 || month > 12) {
            mensaje.innerHTML = `<p class="text-white bg-red-500 p-3 rounded-lg shadow-md">El mes de expiración no es válido (debe ser entre 01 y 12).</p>`;
            animateInElement(mensaje, "duration-400", "translate-y-4");
            setTimeout(() => animateOutElement(mensaje, "duration-400", "translate-y-4"), 3000);
            return;
        }
        const currentYear = new Date().getFullYear() % 100;
        const currentMonth = new Date().getMonth() + 1;
        if (year < currentYear || (year === currentYear && month < currentMonth)) {
            mensaje.innerHTML = `<p class="text-white bg-red-500 p-3 rounded-lg shadow-md">La tarjeta ha expirado. Por favor, introduce una fecha válida.</p>`;
            animateInElement(mensaje, "duration-400", "translate-y-4");
            setTimeout(() => animateOutElement(mensaje, "duration-400", "translate-y-4"), 3000);
            return;
        }

        const formData = new FormData(paymentForm);
        const cardId = cardIdInput.value;

        let url = "/payment";
        let method = "POST";

        if (cardId) {
            url = `/actualizar_tarjeta/${cardId}`;
            method = "PUT";
        }

        console.log(`Enviando ${method} a ${url} con datos:`, Object.fromEntries(formData.entries()));

        fetch(url, {
            method: method,
            body: formData,
        })
            .then((res) => {
                console.log("Respuesta de POST/PUT:", res);
                if (!res.ok) return res.json().then((err) => Promise.reject(err));
                return res.json();
            })
            .then((data) => {
                mensaje.innerHTML = `<p class="text-white bg-green-500 p-3 rounded-lg shadow-md">${data.message}</p>`;
                animateInElement(mensaje, "duration-400", "translate-y-4");
                setTimeout(() => {
                    animateOutElement(mensaje, "duration-400", "translate-y-4");
                    exitEditMode();
                    setTimeout(() => loadCards(), 500);
                }, 2000);
            })
            .catch((err) => {
                console.error("Error al guardar/actualizar la tarjeta:", err);
                mensaje.innerHTML = `<p class="text-white bg-red-500 p-3 rounded-lg shadow-md">${err.error || "Error al guardar/actualizar la tarjeta"}</p>`;
                animateInElement(mensaje, "duration-400", "translate-y-4");
                setTimeout(() => {
                    animateOutElement(mensaje, "duration-400", "translate-y-4");
                }, 3000);
            });
    });
});