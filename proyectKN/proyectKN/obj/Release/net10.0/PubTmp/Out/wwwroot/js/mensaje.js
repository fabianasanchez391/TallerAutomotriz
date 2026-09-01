document.addEventListener("DOMContentLoaded", function () {

    const mensaje = document.getElementById("mensajeSistema");

    if (mensaje) {

        setTimeout(function () {
            mensaje.style.opacity = "0";
            mensaje.style.transform = "translate(-50%, -20px)";
        }, 3000);


        setTimeout(function () {
            mensaje.remove();
        }, 3500);

    }

});