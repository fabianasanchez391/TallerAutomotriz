const modalInventario = document.getElementById("ventanaRegistroInventario");

if (modalInventario) {

    modalInventario.addEventListener("click", function (event) {

        if (event.target === this) {
            this.style.display = "none";
        }

    });

}

const buscarInventario = document.getElementById("buscarInventario");

if (buscarInventario) {

    buscarInventario.addEventListener("keyup", function () {

        const filtro = this.value.toLowerCase();
        const filas = document.querySelectorAll("#tablaInventario tbody tr");

        let visibles = 0;

        filas.forEach(function (fila) {

            if (fila.id === "sinResultadosInventario")
                return;

            const texto = fila.textContent.toLowerCase();

            if (texto.includes(filtro)) {
                fila.style.display = "";
                visibles++;
            } else {
                fila.style.display = "none";
            }

        });

        document.getElementById("sinResultadosInventario").hidden = visibles > 0;

    });

}

function abrirEditarInventario(id, nombre, IdArticulo, descripcion, preciocompra, precioventa, stock, stockminimo, proveedor) {
    document.getElementById("ventanaEditarInventario").style.display = "flex";

    document.getElementById("editConsecutivo").value = id;
    document.getElementById("editNombre").value = nombre;
    document.getElementById("editCodigo").value = IdArticulo;
    document.getElementById("editDescripcion").value = descripcion;
    document.getElementById("editCompra").value = preciocompra;
    document.getElementById("editVenta").value = precioventa;
    document.getElementById("editStock").value = stock;
    document.getElementById("editMinimo").value = stockminimo;
    console.log(proveedor);
 
    const select = document.getElementById("editProveedor");

    for (let i = 0; i < select.options.length; i++) {
        if (select.options[i].text.trim() === proveedor.trim()) {
            select.selectedIndex = i;
            break;
        }
    }
    function seleccionarProveedorPorNombre(nombreProveedor) {
        const select = document.getElementById("editProveedor");

        for (let option of select.options) {
            if (option.text.trim() === nombreProveedor.trim()) {
                select.value = option.value;
                break;
            }
        }
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const modalRegistro = document.getElementById("ventanaRegistroInventario");
    const modalEditar = document.getElementById("ventanaEditarInventario");

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

/*TOAST*/

function mostrarToast(mensaje) {

    const existente = document.getElementById("toastError");

    if (existente) {
        existente.remove();
    }

    const toast = document.createElement("div");
    toast.id = "toastError";
    toast.className = "toast-error";
    toast.innerHTML = "⚠️ " + mensaje;

    const modal = document.querySelector(".modal-inventario-contenido");
    modal.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

setTimeout(function () {

    const alerta = document.querySelector(".alert.alert-danger.text-center");

    if (alerta) {

        alerta.style.transition = "opacity 0.5s";

        alerta.style.opacity = "0";

        setTimeout(() => {
            alerta.remove();
        }, 500);
    }

}, 3000);

document.addEventListener("DOMContentLoaded", function () {

    const mensaje = document.getElementById("mensajeServidor")?.value;

    if (mensaje) {

        document.getElementById("ventanaRegistroInventario").style.display = "flex";
        mostrarToast(mensaje);

    }

});
function validarInventario() {

    const stock = parseInt(document.getElementById("Stock").value);
    const stockMinimo = parseInt(document.getElementById("StockMinimo").value);

    const compra = parseFloat(document.getElementById("PrecioCompra").value);
    const venta = parseFloat(document.getElementById("PrecioVenta").value);

    if (stock < stockMinimo) {
        mostrarToast("El stock actual no puede ser menor que el stock mínimo");


        document.getElementById("Stock").style.border = "1px solid #dc3545";
        document.getElementById("StockMinimo").style.border = "1px solid #dc3545";


        return false;
    }

    if (venta < compra) {
        mostrarToast("El Precio Compra no puede ser mayor al Precio de Venta");

        document.getElementById("PrecioCompra").style.border = "1px solid #dc3545";
        document.getElementById("PrecioVenta").style.border = "1px solid #dc3545";

        return false;
    }

    return true;
}

document.addEventListener("DOMContentLoaded", function () {

    const mensaje = document.getElementById("mensajeServidor")?.value;

    if (mensaje) {

        document.getElementById("ventanaRegistroInventario").style.display = "flex";
        mostrarToast(mensaje);

    }

});

const campos = ["Stock", "StockMinimo", "PrecioCompra", "PrecioVenta"];

campos.forEach(id => {

    const el = document.getElementById(id);

    if (!el) return;

    el.addEventListener("input", function () {

        campos.forEach(x => {
            const input = document.getElementById(x);
            if (input) input.style.border = "";
        });

        const toast = document.getElementById("toastError");
        if (toast) toast.remove();
    });

});

function limpiarFormularioInventario() {

    const form = document.querySelector(".form-inventario");

    if (form) form.reset();

    const proveedor = document.getElementById("Proveedor");
    if (proveedor) proveedor.selectedIndex = 0;

    document.getElementById("ventanaRegistroInventario").style.display = "none";
}