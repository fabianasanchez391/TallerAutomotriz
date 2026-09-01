
document.addEventListener("DOMContentLoaded", function () {
    const modalIngreso = document.getElementById("ventanaRegistroEgreso");

    if (modalIngreso) {
        modalIngreso.addEventListener("click", function (event) {
            if (event.target === this) {
                this.style.display = "none";
            }
        });
    }
});

function abrirEditarEgreso(id, motivo, monto, cantidad, metodoPago, registradoPorId, registradoPorNombre) {

    document.getElementById("ventanaEditarEgreso").style.display = "flex";

    document.getElementById("editConsecutivo").value = id;
    document.getElementById("editMotivo").value = motivo;
    document.getElementById("editMonto").value = monto;
    document.getElementById("editCantidad").value = cantidad;
    document.getElementById("editMetodoPago").value = metodoPago;
    document.getElementById("editRegistradoPorTexto").value = registradoPorNombre;
}


const buscarEgreso = document.getElementById("buscarEgreso");

if (buscarEgreso) {

    buscarEgreso.addEventListener("keyup", function () {
        const filtro = this.value.toLowerCase();
        const filas = document.querySelectorAll("#tablaEgreso tbody tr");

        let visibles = 0;

        filas.forEach(function (fila) {

            if (fila.id === "sinResultadosEgreso")
                return;

            const texto = fila.textContent.toLowerCase();

            if (texto.includes(filtro)) {
                fila.style.display = "";
                visibles++;
            } else {
                fila.style.display = "none";
            }

        });

        document.getElementById("sinResultadosEgreso").hidden = visibles > 0;

    });

}