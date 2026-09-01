
document.addEventListener("DOMContentLoaded", function () {
    const modalIngreso = document.getElementById("ventanaRegistroIngreso");

    if (modalIngreso) {
        modalIngreso.addEventListener("click", function (event) {
            if (event.target === this) {
                this.style.display = "none";
            }
        });
    }
});

function abrirEditarIngreso(id, descripcion, monto, saldo) {

    document.getElementById("ventanaEditarIngreso").style.display = "flex";

    document.getElementById("editConsecutivo").value = id;
    document.getElementById("editDescripcion").value = descripcion;
    document.getElementById("editMonto").value = monto;
    document.getElementById("editSaldo").value = saldo;

}
document.addEventListener("DOMContentLoaded", function () {

    const modalRegistro = document.getElementById("ventanaRegistroIngreso");
    const modalEditar = document.getElementById("ventanaEditarIngreso");

    if (modalRegistro) {

        modalRegistro.addEventListener("click", function (event) {

            if (event.target === this) {
                this.style.display = "none";
            }

        });
    }

    if (modalEditar) {

        modalEditar.addEventListener("click", function (event) {

            if (event.target === this) {
                this.style.display = "none";
            }

        });
    }

});
const buscarIngreso = document.getElementById("buscarIngreso");

if (buscarIngreso) {

    buscarIngreso.addEventListener("keyup", function () {                       
        const filtro = this.value.toLowerCase();
        const filas = document.querySelectorAll("#tablaIngreso tbody tr");

        let visibles = 0;

        filas.forEach(function (fila) {

            if (fila.id === "sinResultadosIngreso")
                return;

            const texto = fila.textContent.toLowerCase();

            if (texto.includes(filtro)) {
                fila.style.display = "";
                visibles++;
            } else {
                fila.style.display = "none";
            }

        });

        document.getElementById("sinResultadosIngreso").hidden = visibles > 0;

    });

}