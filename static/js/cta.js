// Mostrar modal después de 2 segundos
window.addEventListener("load", function () {
    setTimeout(() => {
        const modal = document.getElementById("promo-modal");
        if (modal) {
            modal.classList.remove("hidden");
            requestAnimationFrame(() => {
                modal.querySelector(".transform").style.transform = "scale(1)";
                modal.querySelector(".transform").style.opacity = "1";
            });
        }
    }, 1000);
});


// Cerrar modal al hacer clic en X o fuera
document.getElementById("close-promo-modal").addEventListener("click", () => {
    document.getElementById("promo-modal").classList.add("hidden");
});


document.getElementById("promo-modal").addEventListener("click", (e) => {
    if (e.target === document.getElementById("promo-modal")) {
        document.getElementById("promo-modal").classList.add("hidden");
    }
});
