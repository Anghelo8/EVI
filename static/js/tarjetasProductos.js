document.addEventListener('DOMContentLoaded', function() {
    const productCards = document.querySelectorAll('.product-card');
    const buttons = document.querySelectorAll('.add-to-cart-btn');

    // Animación para los product cards (solo si lo necesitas)
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
            this.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
            this.style.transform = 'translateY(-5px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)';
            this.style.transform = 'translateY(0)';
        });
    });

    // Animación 3D para los botones
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease'; // Transición suave
            this.style.transform = 'scale(1.05) perspective(800px) rotateY(10deg)'; // Efecto 3D
            this.style.opacity = '0.8'; // Disminuir ligeramente la opacidad
        });

        button.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotateY(0deg)'; // Restablecer tamaño y rotación
            this.style.opacity = '1'; // Restaurar opacidad original
        });
    });
});
