function iniciarControlesDelSitio() {
    var statusForm = document.getElementById("statusForm");
    var statusMessage = document.getElementById("statusMessage");
    var placaInput = document.getElementById("placa");

    if (placaInput) {
        placaInput.addEventListener("input", function () {
            placaInput.value = placaInput.value.toUpperCase();
        });
    }

    if (statusForm && statusMessage && placaInput) {
        statusForm.addEventListener("submit", function (event) {
            event.preventDefault();

            var placa = placaInput.value.trim();

            statusMessage.classList.toggle("error", !placa);
            statusMessage.textContent = placa
                ? "Estado encontrado para la placa " + placa + ": vehiculo en revision. Le contactaremos por WhatsApp cuando este listo."
                : "Ingrese el numero de placa para consultar el estado.";
        });
    }

    var revealItems = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.16 });

        revealItems.forEach(function (item) {
            observer.observe(item);
        });
    } else {
        revealItems.forEach(function (item) {
            item.classList.add("is-visible");
        });
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciarControlesDelSitio);
} else {
    iniciarControlesDelSitio();
}


const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");

menuToggle.addEventListener("click", () => {

    mobileMenu.classList.toggle("active");

    menuToggle.innerHTML =
        mobileMenu.classList.contains("active")
            ? "✕"
            : "☰";
});

/* CERRAR MENU AL HACER CLICK */

document.querySelectorAll(".main-nav a").forEach(link => {

    link.addEventListener("click", () => {

        mobileMenu.classList.remove("active");

        menuToggle.innerHTML = "☰";

    });

});


document.addEventListener("DOMContentLoaded", function () {

    const mensaje = document.getElementById("mensajeSistema");

    if (mensaje) {

        setTimeout(() => {
          mensaje.style.opacity = "0";
        }, 2500);

               setTimeout(() => {
        window.location.href = "/Web/Web"; 
           mensaje.remove();
      }, 2500);

    }

});