// Configuración del menú desplegable
document.addEventListener("DOMContentLoaded", function () {
    const dropdownButton = document.querySelector(".dropdown .dropbtn");
    const dropdownContent = document.querySelector(".dropdown-content");

    if (dropdownButton && dropdownContent) {
        // Función para mostrar el menú desplegable
        function showDropdown() {
            dropdownContent.classList.add("show");
        }

        // Función para ocultar el menú desplegable
        function hideDropdown() {
            dropdownContent.classList.remove("show");
        }

        // Evento para mostrar el menú cuando se hace clic en el botón
        dropdownButton.addEventListener("click", function (event) {
            event.stopPropagation(); // Evita que el clic se propague al documento
            showDropdown();
        });

        // Evento para ocultar el menú cuando se hace clic fuera del menú
        document.addEventListener("click", function (event) {
            if (!event.target.closest(".dropdown")) {
                hideDropdown();
            }
        });

        // Opcional: Permitir que el menú se oculte al perder el foco (navegación con teclado)
        dropdownButton.addEventListener("blur", hideDropdown);
    }
});
