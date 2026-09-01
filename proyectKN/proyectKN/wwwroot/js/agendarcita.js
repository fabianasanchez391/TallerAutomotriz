// ==========================================
// PASOS ACTIVOS
// ==========================================

const pasos = document.querySelectorAll(".citas-beneficios article");

function limpiarPasos() {

    pasos.forEach(paso => {
        paso.classList.remove("activo");
    });

}

function activarPaso(numero) {

    limpiarPasos();

    if (pasos[numero - 1]) {
        pasos[numero - 1].classList.add("activo");
    }

}


// ==========================================
// PASO 1
// ==========================================

const camposPaso1 = [
    "cedula",
    "nombre",
    "telefono",
    "email"
];

camposPaso1.forEach(id => {

    const campo = document.getElementById(id);

    if (campo) {

        campo.addEventListener("focus", () => {

            activarPaso(1);

        });

    }

});


// ==========================================
// PASO 2
// ==========================================

const campoFecha = document.getElementById("fecha");

if (campoFecha) {

    campoFecha.addEventListener("focus", () => {

        activarPaso(2);

    });

}


// ==========================================
// BOTONES HORARIO
// ==========================================

const botonesHora = document.querySelectorAll(".horarios-grid button");

botonesHora.forEach(boton => {

    boton.addEventListener("click", () => {

        botonesHora.forEach(btn => {
            btn.classList.remove("activo");
        });

        boton.classList.add("activo");

        activarPaso(2);

    });

});


// ==========================================
// PASO 3
// ==========================================

const campoServicio = document.getElementById("servicio");

if (campoServicio) {

    campoServicio.addEventListener("focus", () => {

        activarPaso(3);

    });

}


