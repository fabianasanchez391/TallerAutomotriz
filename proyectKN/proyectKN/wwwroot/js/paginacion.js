document.addEventListener("DOMContentLoaded", function () {

    const tablas = document.querySelectorAll(".tabla-paginada");

    tablas.forEach(function (tabla) {

        const tbody = tabla.querySelector("tbody");

        if (!tbody) return;

        const filas = tbody.querySelectorAll("tr");

        const filasPorPagina = 10;

        let paginaActual = 1;

        const paginacion =
            tabla.parentElement.querySelector(".paginacion");

        if (!paginacion) return;

        function mostrarPagina() {

            const inicio =
                (paginaActual - 1) * filasPorPagina;

            const fin =
                inicio + filasPorPagina;

            filas.forEach(function (fila, index) {

                if (index >= inicio && index < fin) {
                    fila.style.display = "";
                }
                else {
                    fila.style.display = "none";
                }

            });

            renderBotones();
        }

        function renderBotones() {

            const totalPaginas =
                Math.ceil(filas.length / filasPorPagina);

            paginacion.innerHTML = "";

            const btnAnterior =
                document.createElement("button");

            btnAnterior.innerText = "Anterior";

            btnAnterior.disabled =
                paginaActual === 1;

            btnAnterior.onclick = function () {

                if (paginaActual > 1) {
                    paginaActual--;
                    mostrarPagina();
                }

            };

            if (paginaActual > 1) {
                paginacion.appendChild(btnAnterior);
            }

            const span =
                document.createElement("span");

            span.className = "pagina-actual";

            span.innerText =
                `Página ${paginaActual} de ${totalPaginas}`;

            paginacion.appendChild(span);

            const btnSiguiente =
                document.createElement("button");

            btnSiguiente.innerText = "Siguiente";

            btnSiguiente.disabled =
                paginaActual === totalPaginas;

            btnSiguiente.onclick = function () {

                if (paginaActual < totalPaginas) {
                    paginaActual++;
                    mostrarPagina();
                }

            };

            if (paginaActual < totalPaginas) {
                paginacion.appendChild(btnSiguiente);
            }
        }

        mostrarPagina();

    });

});

function reiniciarPaginacionReporte() {

    const tabla = document.getElementById("reportTable");

    if (!tabla) return;

    const tbody = document.getElementById("reportBody");

    if (!tbody) return;

    const filas = tbody.querySelectorAll("tr");

    const filasPorPagina = 10;

    let paginaActual = 1;

    const paginacion =
        tabla.parentElement.querySelector(".paginacion");

    if (!paginacion) return;

    function mostrarPagina() {

        const inicio =
            (paginaActual - 1) * filasPorPagina;

        const fin =
            inicio + filasPorPagina;

        filas.forEach(function (fila, index) {

            if (index >= inicio && index < fin) {
                fila.style.display = "";
            } else {
                fila.style.display = "none";
            }

        });

        renderBotones();
    }

    function renderBotones() {

        const totalPaginas =
            Math.ceil(filas.length / filasPorPagina);

        paginacion.innerHTML = "";

        // Si solo hay una página, no mostrar paginación
        if (filas.length <= filasPorPagina) {
            return;
        }

        const btnAnterior =
            document.createElement("button");

        btnAnterior.innerText = "Anterior";

        btnAnterior.onclick = function () {

            if (paginaActual > 1) {
                paginaActual--;
                mostrarPagina();
            }

        };

        if (paginaActual > 1) {
            paginacion.appendChild(btnAnterior);
        }

        const span =
            document.createElement("span");

        span.className = "pagina-actual";

        span.innerText =
            `Página ${paginaActual} de ${totalPaginas}`;

        paginacion.appendChild(span);

        const btnSiguiente =
            document.createElement("button");

        btnSiguiente.innerText = "Siguiente";

        btnSiguiente.onclick = function () {

            if (paginaActual < totalPaginas) {
                paginaActual++;
                mostrarPagina();
            }

        };

        if (paginaActual < totalPaginas) {
            paginacion.appendChild(btnSiguiente);
        }
    }

    mostrarPagina();
}