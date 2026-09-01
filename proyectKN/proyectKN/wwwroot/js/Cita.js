

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
                function eliminarFila(boton) {
                    // Pedimos confirmación
                    if (!confirm("¿Desea cancelar esta cita de la tabla?")) return;

                    // Encontrar la fila del botón
                    var fila = boton.closest("tr");

                    // Remover la fila de la tabla
                    fila.remove();
                }
            }

        });
    }
}

function cargarHorasOcupadas() {
    limpiarEstadoCitas();
    const fecha = document.getElementById("FechaCita").value;
    const inputHora = document.getElementById("HoraCita");
    const mensaje = document.getElementById("mensajeEstado");

    if (!fecha) return;

    mensaje.style.display = "none";
    mensaje.textContent = "";

    const ahora = new Date();

    const hoy =
        ahora.getFullYear() + "-" +
        String(ahora.getMonth() + 1).padStart(2, "0") + "-" +
        String(ahora.getDate()).padStart(2, "0");

    const horaActual =
        String(ahora.getHours()).padStart(2, "0") + ":" +
        String(ahora.getMinutes()).padStart(2, "0");

    fetch(`/Cita/ObtenerHorariosDisponibles?fecha=${fecha}`)

        .then(response => response.json())

        .then(horarios => {

            // No existe horario
            if (!horarios || horarios.length === 0) {

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
                    mensaje.innerHTML = "El taller se encuentra de Vacaciones...";
                } else {
                    mensaje.innerHTML = "El taller se encuentra Cerrado...";
                }

                document.querySelectorAll(".btn-hora").forEach(btn => {
                    btn.style.display = "none";
                });

                return Promise.reject("TallerCerrado");
            }

            // Mostrar solo horas configuradas
            document.querySelectorAll(".btn-hora").forEach(btn => {

                const horaBoton = btn.dataset.hora;

                const existe = horarios.some(h =>
                    h.horaInicio.substring(0, 5) === horaBoton
                );

                btn.style.display = existe ? "inline-block" : "none";

            });

            return fetch(`/Cita/ObtenerHorasOcupadas?fecha=${encodeURIComponent(fecha)}`);

        })

        .then(response => response.json())

        .then(horasOcupadas => {

            document.querySelectorAll(".btn-hora").forEach(btn => {

                if (btn.style.display === "none")
                    return;

                const hora = btn.dataset.hora;

                btn.disabled = false;

                btn.classList.remove(
                    "hora-ocupada",
                    "hora-pasada",
                    "activo"
                );

                if (horasOcupadas.includes(hora)) {

                    btn.disabled = true;
                    btn.classList.add("hora-ocupada");

                }

                if (fecha === hoy && hora <= horaActual) {

                    btn.disabled = true;
                    btn.classList.add("hora-pasada");

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

            if (error === "SinHorario" || error === "Cerrado")
                return;

            console.error(error);

        });

}
function confirmarCancelacion(id) {
    Swal.fire({
        title: "¿Desea cancelar esta cita?",
        text: "Esta acción no se puede deshacer",
        icon: "warning",
        background: "#ffffff",
        color: "#000000",
        showCancelButton: true,
        confirmButtonColor: "#dc3545",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Sí, cancelar",
        cancelButtonText: "No"
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = "/Cita/CancelarCita/" + id;
        }
    });
}


document.getElementById("Telefono").addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, ''); 

    if (this.value.length > 8) {
        this.value = this.value.slice(0, 8);
    }
});
document.addEventListener("DOMContentLoaded", function () {
    const modalCita = document.getElementById("ventanaRegistroCita");

    if (modalCita) {
        modalCita.addEventListener("click", function (event) {
            if (event.target === this) {
                this.style.display = "none";
            }
        });
    }
});


function cerrarModalCita() {
    const modal = document.getElementById("ventanaRegistroCita");
    const form = document.getElementById("formRegistro");
    const horaInput = document.getElementById("HoraCita");
  

    if (form) {
        form.reset();
    }

    if (horaInput) {
        horaInput.value = "";
    }

    document.querySelectorAll(".btn-hora").forEach(function (btn) {
        btn.classList.remove("activo");
        btn.classList.remove("hora-activa");
    });

    modal.style.display = "none";
}

function abrirEditarCita(id, cedula, nombreCliente, fechaCita, horaCita, telefono, email, servicio, estado, creadoPor) {

    document.getElementById("ventanaEditarCita").style.display = "flex";

    document.getElementById("editConsecutivo").value = id;
    document.getElementById("editCedula").value = cedula;
    document.getElementById("editCliente").value = nombreCliente;
    document.getElementById("editFechaCita").value = fechaCita;
    document.getElementById("editHoraCita").value = horaCita;
    document.getElementById("editTelefono").value = telefono;
    document.getElementById("editEmail").value = email;
    document.getElementById("editServicio").value = servicio;


    cargarHorasOcupadasEditar(false);
    seleccionarEstadoCitaPorNombre(estado);

}

function seleccionarHoraEditar(hora, boton) {

    document.getElementById("editHoraCita").value = hora;

    document.querySelectorAll("#ventanaEditarCita .btn-hora").forEach(btn => {
        btn.classList.remove("activo");
    });

    boton.classList.add("activo");
}

function marcarHoraActualEditar() {

    const inputHora = document.getElementById("editHoraCita");

    if (!inputHora) return;

    const horaActual = (inputHora.value || "").substring(0, 5);

    document.querySelectorAll("#ventanaEditarCita .btn-hora").forEach(btn => {

        btn.classList.remove("activo");

        const horaBoton = (btn.dataset.hora || "").substring(0, 5);

        if (horaBoton === horaActual) {
            btn.classList.add("activo");
        }

    });
}
//editar
function cargarHorasOcupadasEditar(limpiarSeleccion = true) {

    const fechaInput = document.getElementById("editFechaCita");
    const idCitaInput = document.getElementById("editConsecutivo");
    const horaInput = document.getElementById("editHoraCita"); 
    const mensaje = document.getElementById("editmensajeEstado");

    if (!fechaInput || !horaInput) return;

    const fecha = fechaInput.value;
    const idCita = idCitaInput ? idCitaInput.value : "";

    if (!fecha) return;

    // limpiar mensaje al cambiar fecha
    if (mensaje) {
        mensaje.style.display = "none";
        mensaje.innerHTML = "";
    }

    const ahora = new Date();

    const hoy =
        ahora.getFullYear() + "-" +
        String(ahora.getMonth() + 1).padStart(2, "0") + "-" +
        String(ahora.getDate()).padStart(2, "0");

    const horaActual =
        String(ahora.getHours()).padStart(2, "0") + ":" +
        String(ahora.getMinutes()).padStart(2, "0");

    if (limpiarSeleccion) {
        horaInput.value = "";
        document.querySelectorAll("#ventanaEditarCita .btn-hora")
            .forEach(btn => btn.classList.remove("activo"));
    }

    fetch(`/Cita/ObtenerHorariosDisponibles?fecha=${encodeURIComponent(fecha)}`)
        .then(response => response.json())
        .then(horarios => {

            // SIN HORARIO
            if (!horarios || horarios.length === 0) {

                document.querySelectorAll("#ventanaEditarCita .btn-hora")
                    .forEach(btn => btn.style.display = "none");

                if (mensaje) {
                    mensaje.style.display = "block";
                    mensaje.innerHTML = "No existen horarios configurados para esta fecha.";
                }

                return Promise.reject("SinHorario");
            }

            const estado = horarios[0].estado;

            // CERRADO / VACACIONES
            if (estado === "Cerrado" || estado === "Vacaciones") {

                document.querySelectorAll("#ventanaEditarCita .btn-hora")
                    .forEach(btn => btn.style.display = "none");

                if (mensaje) {
                    mensaje.style.display = "block";
                    mensaje.innerHTML =
                        estado === "Vacaciones"
                            ? "El taller está de <b>Vacaciones</b> en esta fecha."
                            : "El taller está <b>Cerrado</b> en esta fecha.";
                }

                return Promise.reject("Cerrado");
            }

            // MOSTRAR HORAS CONFIGURADAS
            document.querySelectorAll("#ventanaEditarCita .btn-hora").forEach(btn => {

                const horaBoton = btn.dataset.hora;

                const existe = horarios.some(h =>
                    h.horaInicio.substring(0, 5) === horaBoton
                );

                btn.style.display = existe ? "inline-block" : "none";
                btn.disabled = false;
                btn.classList.remove("hora-ocupada", "hora-pasada", "activo");
            });

            return fetch(`/Cita/ObtenerHorasOcupadas?fecha=${encodeURIComponent(fecha)}&idCita=${idCita}`);
        })

        .then(response => response.json())
        .then(horasOcupadas => {

            const ocupadas = horasOcupadas.map(h => (h || "").substring(0, 5));

            document.querySelectorAll("#ventanaEditarCita .btn-hora").forEach(btn => {

                if (btn.style.display === "none") return;

                const hora = btn.dataset.hora;

                // OCUPADA
                if (ocupadas.includes(hora)) {
                    btn.disabled = true;
                    btn.classList.add("hora-ocupada");
                }

                // PASADA
                if (fecha === hoy && hora <= horaActual) {
                    btn.disabled = true;
                    btn.classList.add("hora-pasada");

                    if (horaInput.value === hora) {
                        horaInput.value = "";
                    }
                }
            });
             marcarHoraActualEditar();
        })

        .catch(error => {
            if (error === "SinHorario" || error === "Cerrado") return;
            console.error(error);
        });
}

document.getElementById("editTelefono").addEventListener("input", function () {

    this.value = this.value.replace(/\D/g, '');

    if (this.value.length > 8) {
        this.value = this.value.slice(0, 8);
    }

});
function seleccionarEstadoCitaPorNombre(nombreEstado) {
    const select = document.getElementById("editEstado");

    for (let option of select.options) {
        if (option.text.trim() === nombreEstado.trim()) {
            select.value = option.value;
            break;
        }
    }
}
document.addEventListener("DOMContentLoaded", function () {

    const formulario = document.getElementById("formRegistro");

    if (!formulario) return;

    formulario.addEventListener("submit", function (e) {

     
        const hora = document.getElementById("HoraCita").value;
        const mensaje = document.getElementById("mensajeHora");

        if (!hora) {

            e.preventDefault();

            mensaje.style.display = "block";
            mensaje.textContent = "Debe seleccionar una hora para la cita";

            return;
        }

        mensaje.style.display = "none";

    });

});
function seleccionarHora(hora, boton) {

    document.getElementById("HoraCita").value = hora;

    document.querySelectorAll(".hora-grid button").forEach(btn => {
        btn.classList.remove("activo");
    });

    boton.classList.add("activo");

    const mensaje = document.getElementById("mensajeHora");
    if (mensaje) {
        mensaje.style.display = "none";
    }
}

const buscarCita = document.getElementById("buscarCita");

if (buscarCita) {

    buscarCita.addEventListener("keyup", function () {

        const filtro = this.value.toLowerCase();
        const filas = document.querySelectorAll("#tablaCita tbody tr");

        let visibles = 0;

        filas.forEach(function (fila) {

            if (fila.id === "sinResultadosCita")
                return;

            const texto = fila.textContent.toLowerCase();

            if (texto.includes(filtro)) {
                fila.style.display = "";
                visibles++;
            } else {
                fila.style.display = "none";
            }

        });

        document.getElementById("sinResultadosCita").hidden = visibles > 0;

    });

}

function limpiarEstadoCitas() {
    document.getElementById("HoraCita").value = "";

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