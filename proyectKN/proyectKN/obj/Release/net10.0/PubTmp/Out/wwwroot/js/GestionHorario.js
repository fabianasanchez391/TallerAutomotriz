document.addEventListener('DOMContentLoaded', function () {

    const calendarEl = document.getElementById('calendar');
    const data = window.horarios || [];

    const horariosPorFecha = {};

    data.forEach(item => {

        const fecha = item.fecha.split("T")[0];

        if (!horariosPorFecha[fecha]) {

            horariosPorFecha[fecha] = {
                estado: item.estado,
                horas: []
            };

        }

        horariosPorFecha[fecha].horas.push(
            item.horaInicio.substring(0, 5)
        );

    });

    const eventos = Object.keys(horariosPorFecha).map(fecha => {

        return {
            start: fecha,
            allDay: true,
            extendedProps: {
                estado: horariosPorFecha[fecha].estado,
                horas: horariosPorFecha[fecha].horas
            }
        };

    });

    const calendar = new FullCalendar.Calendar(calendarEl, {

        initialView: 'dayGridMonth',
        locale: 'es',
        height: 950,

        validRange: function () {
            const hoy = new Date();

            hoy.setHours(0, 0, 0, 0);

            return {
                start: hoy
            };
        },

        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: ''
        },

        buttonText: {
            today: 'Hoy'
        },

        events: eventos,
        dateClick: function (info) {

            // Quitar selección anterior
            document.querySelectorAll(".fc-daygrid-day")
                .forEach(dia => dia.classList.remove("dia-seleccionado"));

            // Marcar día seleccionado
            info.dayEl.classList.add("dia-seleccionado");

            const fecha = info.dateStr;

            console.log("Fecha seleccionada:", fecha);

            // Colocar la fecha seleccionada
            document.getElementById("fechaInicio").value = fecha;
            document.getElementById("fechaFin").value = fecha;

            // Consultar si ya existe configuración para esa fecha
            fetch(`/Horario/ConsultarHorarioPorFecha?fecha=${fecha}`)
                .then(response => response.json())
                .then(data => {

                    console.log("Datos:", data);

                    // Si la fecha ya tiene configuración
                    if (data && data.length > 0) {

                        const estado = document.getElementById("estadoDia");

                        for (let i = 0; i < estado.options.length; i++) {

                            if (estado.options[i].text.trim() === data[0].estado) {

                                estado.selectedIndex = i;
                                break;
                            }
                        }

                        cambiarEstadoDia();

                        // Limpiar checks
                        document.querySelectorAll(
                            'input[name="HorasSeleccionadas"]'
                        ).forEach(c => c.checked = false);

                        // Marcar horas configuradas
                        data.forEach(h => {

                            const hora = h.horaInicio.substring(0, 5);

                            const check = document.querySelector(
                                `input[name="HorasSeleccionadas"][value="${hora}"]`
                            );

                            if (check) {
                                check.checked = true;
                            }

                        });

                        document.getElementById("btnGuardar").innerHTML =
                            '<i class="fas fa-save"></i> Actualizar configuración';

                    } else {

                        // Si no existe configuración
                        document.getElementById("btnGuardar").innerHTML =
                            '<i class="fas fa-save"></i> Guardar configuración';

                        // Estado por defecto
                        const estado = document.getElementById("estadoDia");

                        if (estado) {
                            estado.selectedIndex = 0;
                        }

                        // Limpiar horas
                        document.querySelectorAll(
                            'input[name="HorasSeleccionadas"]'
                        ).forEach(c => {
                            c.checked = false;
                            c.disabled = false;
                        });

                        cambiarEstadoDia();
                    }

                })
                .catch(error => {

                    console.error("Error al consultar horario:", error);

                });
        },


        eventClick: function (info) {
            console.log(info.event.startStr);

            const fecha = info.event.startStr;

            fetch(`/Horario/ConsultarHorarioPorFecha?fecha=${fecha}`)
                .then(response => response.json())
                .then(data => {

                    console.log(data);

                    // Fecha inicio y fin
                    document.getElementById("fechaInicio").value = fecha;
                    document.getElementById("fechaFin").value = fecha;

                    // Estado
                    const estado = document.getElementById("estadoDia");

                    for (let i = 0; i < estado.options.length; i++) {

                        if (estado.options[i].text.trim() === data[0].estado) {
                            estado.selectedIndex = i;
                            break;
                        }
                    }

                    cambiarEstadoDia();

                    // Limpiar checks
                    document.querySelectorAll('input[name="HorasSeleccionadas"]')
                        .forEach(c => c.checked = false);

                    // Marcar horas
                    data.forEach(h => {

                        const hora = h.horaInicio.substring(0, 5);

                        const check = document.querySelector(
                            `input[name="HorasSeleccionadas"][value="${hora}"]`
                        );

                        if (check)
                            check.checked = true;

                    });

                   
                    document.getElementById("btnGuardar").innerHTML =
                        '<i class="fas fa-save"></i> Actualizar configuración';

                });

        },
        eventContent: function (arg) {

            const estado = arg.event.extendedProps.estado;
            const horas = arg.event.extendedProps.horas || [];

            // cerrado
            if (estado === "Cerrado") {

                return {
                    html: `
                <div class="dia-cerrado">
                     CERRADO
                </div>
            `
                };

            }

            //  vacaciones
            if (estado === "Vacaciones") {

                return {
                    html: `
                <div class="dia-vacaciones">
                    VACACIONES
                </div>
            `
                };

            }

            // abierto
            let html = `<div class="horas-calendario">`;
            horas.forEach(hora => {

                const horaFormateada = formatearHora(hora);

                html += `
        <div class="fila-hora">
            ${horaFormateada}
        </div>`;
            });
            html += `</div>`;

            return { html };

        }
    });

    calendar.render();

   
    cambiarEstadoDia();

    const inicio = document.getElementById("fechaInicio");
    const fin = document.getElementById("fechaFin");

    if (inicio) inicio.addEventListener("change", validarRangoFechas);
    if (fin) fin.addEventListener("change", validarRangoFechas);

});

function formatearHora(hora) {

    let [h, m] = hora.split(":");

    h = parseInt(h);

    const periodo = h >= 12 ? "PM" : "AM";

    if (h === 0)
        h = 12;
    else if (h > 12)
        h -= 12;

    return `${h}:${m} ${periodo}`;
}

// BLOQUEO DE HORAS POR ESTADO

function cambiarEstadoDia() {

    const combo = document.getElementById("estadoDia");

    if (!combo) return;

    const texto = combo.options[combo.selectedIndex].text.trim();

    const bloquear =
        texto === "Cerrado" ||
        texto === "Vacaciones";

    document.querySelectorAll('input[name="HorasSeleccionadas"]')
        .forEach(check => {

            check.disabled = bloquear;

            if (bloquear) {
                check.checked = false;
            }
        });
}



// VALIDACIÓN RANGO DE FECHAS

function validarRangoFechas() {

    const fechaInicio = document.getElementById("fechaInicio");
    const fechaFin = document.getElementById("fechaFin");

    if (!fechaInicio || !fechaFin) return;

    if (!fechaInicio.value) return;

    // impedir que fin sea menor que inicio
    fechaFin.min = fechaInicio.value;

    if (fechaFin.value && fechaFin.value < fechaInicio.value) {

        Swal.fire({
            icon: "warning",
            title: "Seleccione una hora",
            background: "#ffffff",
            text: "Debe seleccionar al menos una hora cuando el horario del taller es Abierto.",
            color: "#000000",
            confirmButtonColor: "#2563eb"
        });
        fechaFin.value = "";
    }
}


document.querySelector("form").addEventListener("submit", function (e) {

    const estado = document.getElementById("estadoDia");

    const textoEstado =
        estado.options[estado.selectedIndex].text.trim();

    if (textoEstado === "Abierto") {

        const seleccionadas = document.querySelectorAll(
            'input[name="HorasSeleccionadas"]:checked'
        );

        if (seleccionadas.length === 0) {

            e.preventDefault();

            Swal.fire({
                icon: "warning",
                title: "Seleccione una hora",
                text: "Debe seleccionar al menos una hora cuando el horario del taller es Abierto.",
                confirmButtonColor: "#2563eb"
            });

            return;
        }
    }

});

function cancelarConfiguracion() {

    document.querySelector("form").reset();

    cambiarEstadoDia(); 

    document.querySelectorAll('input[name="HorasSeleccionadas"]').forEach(chk => {
        chk.checked = false;
    });
}

document.addEventListener("DOMContentLoaded", function () {

    const fechaInicio = document.getElementById("fechaInicio");
    const fechaFin = document.getElementById("fechaFin");

    const hoy = new Date();

    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, "0");
    const dd = String(hoy.getDate()).padStart(2, "0");

    const fechaMinima = `${yyyy}-${mm}-${dd}`;

    if (fechaInicio) fechaInicio.min = fechaMinima;
    if (fechaFin) fechaFin.min = fechaMinima;
});