function ConsultarCliente() {

    $("#NombreCliente").val("");

    var cedula = $("#Cedula").val().trim();

    if (cedula.length >= 9) {

        $.ajax({
            url: "https://apis.gometa.org/cedulas/" + cedula,
            type: "GET",

            success: function (data) {

                if (data.results.length > 0) {

                    $("#NombreCliente").val(data.results[0].fullname);

                }

            }

        });

    }

}


// TELEFONO
const telefono = document.getElementById("webTelefono");

if (telefono) {

    telefono.addEventListener("input", function () {

        this.value = this.value.replace(/\D/g, '');

        if (this.value.length > 8) {

            this.value = this.value.slice(0, 8);

        }

    });

}


// SELECCIONAR HORA
function seleccionarHoraWeb(hora, boton) {
    document.getElementById("HoraCitaWeb").value = hora;

    document.querySelectorAll(".btn-hora").forEach(btn => {
        btn.classList.remove("activo");
    });

    boton.classList.add("activo");
}



// CARGAR HORAS OCUPADAS
function cargarHorasOcupadasWeb() {
    limpiarEstadoCitas();
    const fecha = document.getElementById("FechaCitaWeb").value;
    const inputHora = document.getElementById("HoraCitaWeb");
    const mensaje = document.getElementById("mensajeEstado");

    if (!fecha) return;

    // Limpiar mensaje
    mensaje.style.display = "none";
    mensaje.textContent = "";

    // Mostrar nuevamente todos los botones
    document.querySelectorAll(".btn-hora").forEach(btn => {
        btn.style.display = "block";
    });

    const ahora = new Date();

    const hoy = ahora.getFullYear() + "-" +
        String(ahora.getMonth() + 1).padStart(2, "0") + "-" +
        String(ahora.getDate()).padStart(2, "0");

    const horaActual =
        String(ahora.getHours()).padStart(2, "0") + ":" +
        String(ahora.getMinutes()).padStart(2, "0");

    fetch(`/Web/ObtenerHorariosDisponibles?fecha=${fecha}`)
        .then(response => response.json())
        .then(horarios => {

            console.log(horarios);

            // Si no existe horario para ese día
            if (horarios.length === 0) {

                mensaje.style.display = "block";
                mensaje.textContent = "No existen horarios configurados para esta fecha.";

                document.querySelectorAll(".btn-hora").forEach(btn => {
                    btn.style.display = "none";
                });

                return Promise.reject("SinHorario");
            }

            // Estado del taller
            const estado = horarios[0].estado;

            if (estado === "Cerrado" || estado === "Vacaciones") {

                mensaje.style.display = "block";

                if (estado === "Vacaciones") {
                    mensaje.innerHTML = `El taller se encuentra de <span class="estado-texto">Vacaciones</span> para la fecha seleccionada`;
                }
                else if (estado === "Cerrado") {
                    mensaje.innerHTML = `El taller se encuentra <span class="estado-texto">Cerrado</span> para la fecha seleccionada`;
                }

                document.querySelectorAll(".btn-hora").forEach(btn => {
                    btn.style.display = "none";
                });

                return Promise.reject("TallerCerrado");
            }

            // Mostrar solo horas configuradas
            document.querySelectorAll(".btn-hora").forEach(boton => {

                const hora = boton.dataset.hora;

                const existe = horarios.some(h =>
                    h.horaInicio.substring(0, 5) === hora
                );

                console.log(
                    "Botón:", hora,
                    "| Existe:", existe,
                    "| BD:", horarios.map(h => h.horaInicio.substring(0, 5))
                );
                boton.style.display = existe ? "block" : "none";
            });

            return fetch(`/Web/ObtenerHorasOcupadas?fecha=${encodeURIComponent(fecha)}`);
        })

        .then(response => response.json())

        .then(horasOcupadas => {

            document.querySelectorAll(".btn-hora").forEach(boton => {

                if (boton.style.display === "none")
                    return;

                const hora = boton.dataset.hora;

                boton.disabled = false;
                boton.classList.remove("hora-ocupada", "hora-pasada", "activo");

                if (horasOcupadas.includes(hora)) {

                    boton.disabled = true;
                    boton.classList.add("hora-ocupada");
                }

                if (fecha === hoy && hora <= horaActual) {

                    boton.disabled = true;
                    boton.classList.add("hora-pasada");

                    if (inputHora.value === hora) {
                        inputHora.value = "";
                        // limpiar mensaje de error
                        if (mensaje) {
                            mensaje.style.display = "none";
                            mensaje.textContent = "";
                        }

                        // quitar selección visual de botones
                        document.querySelectorAll(".btn-hora").forEach(btn => {
                            btn.classList.remove("activo");
                        });
                    }
                }

            });

        })

        .catch(error => {

            if (error === "TallerCerrado" || error === "SinHorario")
                return;

            console.error("Error al cargar horas:", error);

        });

}


// FORMULARIO
document.addEventListener("DOMContentLoaded", function () {

    const formularioWeb = document.querySelector(".citas-formulario");

    if (!formularioWeb) return;

    formularioWeb.addEventListener("submit", function (event) {

        const fecha = document.getElementById("FechaCitaWeb").value;
        const hora = document.getElementById("HoraCitaWeb").value;
        const mensaje = document.getElementById("mensajeHora");

        mensaje.style.display = "none";
        mensaje.textContent = "";

        if (!fecha) {

            event.preventDefault();

            Swal.fire({
                icon: "warning",
                title: "Seleccione una fecha"
            });

            return;
        }

        if (!hora) {

            event.preventDefault();

            mensaje.style.display = "block";
            mensaje.textContent = "Debe seleccionar una hora para la cita";

            return;
        }

    });

});
function seleccionarHoraWeb(hora, boton) {

    document.getElementById("HoraCitaWeb").value = hora;

    document.querySelectorAll(".btn-hora").forEach(btn => {
        btn.classList.remove("activo");
    });

    boton.classList.add("activo");

    const mensaje = document.getElementById("mensajeHora");

    if (mensaje) {
        mensaje.style.display = "none";
        mensaje.textContent = "";
    }
}


function limpiarEstadoCitas() {
    document.getElementById("HoraCitaWeb").value = "";

    document.querySelectorAll(".btn-hora").forEach(btn => {
        btn.classList.remove("activo", "hora-ocupada", "hora-pasada");
        btn.disabled = false;
        btn.style.display = "block";
    });

    const mensajes = ["mensajeHora", "mensajeEstado"];

    mensajes.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.style.display = "none";
            el.textContent = "";
        }


    });
}

document.addEventListener("DOMContentLoaded", function () {

    const inputFecha = document.getElementById("FechaCitaWeb");

    if (inputFecha) {

        const hoy = new Date();

        const yyyy = hoy.getFullYear();
        const mm = String(hoy.getMonth() + 1).padStart(2, "0");
        const dd = String(hoy.getDate()).padStart(2, "0");

        const fechaMinima = `${yyyy}-${mm}-${dd}`;

        inputFecha.min = fechaMinima;
    }

});

document.addEventListener("DOMContentLoaded", function () {

    const mensaje = document.getElementById("mensajeExitoServidor");

    if (mensaje) {

        setTimeout(function () {

            const alerta = document.getElementById("mensajeExito");

            if (alerta) {
                alerta.style.opacity = "0";
            }

        }, 2000);

        setTimeout(function () {
            window.location.href = "/Web/Web"; 
        }, 2500);
    }

});