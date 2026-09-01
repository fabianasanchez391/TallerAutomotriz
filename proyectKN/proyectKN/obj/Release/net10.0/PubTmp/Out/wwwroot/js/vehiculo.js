function ConsultarDueno() {

    $("#Nombre_Cliente").val("");
    var cedula = $("#Cedula").val().trim();

    if (cedula.length >= 9) {
        $.ajax({
            url: "https://apis.gometa.org/cedulas/" + cedula,
            type: "GET",
            success: function (data) {
                if (data.results.length > 0) {
                    $("#Nombre_Cliente").val(data.results[0].fullname);
                    // Quitar borde rojo
                    document.getElementById("Nombre_Cliente").style.border = "";

                    // Quitar el toast si existe
                    const toast = document.getElementById("toastError");
                    if (toast) {
                        toast.remove();
                    }
                }

            }

        });

    }

}
document.getElementById("Anio").addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, '');

    if (this.value.length > 4) {
        this.value = this.value.slice(0, 4);
    }
});
document.getElementById("Telefono").addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, '');

    if (this.value.length > 8) {
        this.value = this.value.slice(0, 8);
    }
});

document.getElementById("editPlaca").addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, '');

    if (this.value.length > 6) {
        this.value = this.value.slice(0, 6);
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const modalVehiculo = document.getElementById("ventanaRegistroVehiculo");

    if (modalVehiculo) {
        modalVehiculo.addEventListener("click", function (event) {
            if (event.target === this) {
                this.style.display = "none";
            }
        });
    }
 
document.getElementById("Placa").addEventListener("input", function () {
    this.value = this.value
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '');

    if (this.value.length > 6) {
        this.value = this.value.slice(0, 6);
    }
    
});
    
});

function abrirEditarVehiculo(id, marca, modelo, anio, placa, cedula, propietario, telefono, estado, problema, revision, deuda, monto) {

    console.log(document.getElementById("editDeudaVehiculo"));
    console.log(document.getElementById("editMontoVehiculo"));

    document.getElementById("ventanaEditarVehiculo").style.display = "flex";

    document.getElementById("editConsecutivo").value = id;
    document.getElementById("editMarca").value = marca;
    document.getElementById("editModelo").value = modelo;
    document.getElementById("editAnio").value = anio;
    document.getElementById("editPlaca").value = placa;
    document.getElementById("editCedula").value = cedula;
    document.getElementById("editPropietario").value = propietario;
    document.getElementById("editTelefono").value = telefono;
    document.getElementById("editProblema").value = problema;
    document.getElementById("editRevision").value = revision;
    document.getElementById("editDeudaVehiculo").value = deuda;
    document.getElementById("editMontoVehiculo").value = monto;

    seleccionarEstado(estado);

}


document.addEventListener("DOMContentLoaded", function () {
    const modalRegistro = document.getElementById("ventanaRegistroVehiculo");
    const modalEditar = document.getElementById("ventanaEditarVehiculo");

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
function seleccionarEstado(Estado) {
    const select = document.getElementById("editEstado");

    for (let option of select.options) {
        if (option.text.trim() === Estado.trim()) {
            select.value = option.value;
            break;
        }
    }
}

const buscarVehiculo = document.getElementById("buscarVehiculo");

if (buscarVehiculo) {

    buscarVehiculo.addEventListener("keyup", function () {
        const filtro = this.value.toLowerCase();
        const filas = document.querySelectorAll("#tablaVehiculo tbody tr");

        let visibles = 0;

        filas.forEach(function (fila) {

            if (fila.id === "sinResultadosVehiculo")
                return;

            const texto = fila.textContent.toLowerCase();

            if (texto.includes(filtro)) {
                fila.style.display = "";
                visibles++;
            } else {
                fila.style.display = "none";
            }

        });

        document.getElementById("sinResultadosVehiculo").hidden = visibles > 0;

    });

}

function validarFormulario() {

    var nombre = document.getElementById("Nombre_Cliente");

    nombre.style.border = "";

    if (nombre.value.trim() === "") {

        nombre.style.border = "1px solid #dc3545";

        mostrarToast("Debe ingresar una identificación válida");

        return false;
    }

    return true;
}

function mostrarToast(mensaje) {

    const existente = document.getElementById("toastError");

    if (existente) {
        existente.remove();
    }

    const toast = document.createElement("div");
    toast.id = "toastError";
    toast.className = "toast-error";
    toast.innerHTML = "⚠️ " + mensaje;

    const modal = document.querySelector(".modal-contenido");
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

        document.getElementById("ventanaRegistroVehiculo").style.display = "flex";
        mostrarToast(mensaje);

    }

});

function limpiarFormularioVehiculo() {

    const form = document.querySelector(".form-vehiculo");
    if (form) form.reset();

    document.querySelectorAll(".form-vehiculo input").forEach(i => {
        i.style.border = "";
    });

    const toast = document.getElementById("toastError");
    if (toast) toast.remove();

    document.getElementById("ventanaRegistroVehiculo").style.display = "none";
}
