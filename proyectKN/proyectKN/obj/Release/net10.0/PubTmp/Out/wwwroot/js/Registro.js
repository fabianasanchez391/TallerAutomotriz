
//AJAX = estrructura estandar, para que se haan las cosas en timempo real
function ConsultarNombre() {

    $("#NombreCompleto").val("");
    var cedula = $("#Cedula").val().trim();

    if (cedula.length >= 9) {
        $.ajax({
            url: "https://apis.gometa.org/cedulas/" + cedula,
            type: "GET",
            success: function (data) {
                if (data.results.length > 0) {
                    $("#NombreCompleto").val(data.results[0].fullname);
                    // Quitar borde rojo
                    document.getElementById("NombreCompleto").style.border = "";

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
                        }
                    }

                });
    }

}

document.getElementById("Contrasenna").addEventListener("input", function () {

    const valor = this.value;

    if (valor.length < 6) {
        this.setCustomValidity("Debe tener al menos 6 caracteres");
    } else if (!/\d/.test(valor)) {
        this.setCustomValidity("Debe incluir al menos un número");
    } else {
        this.setCustomValidity("");
    }

});


function cambiarEstadoUsuario(boton, consecutivo) {

    fetch('/Usuario/CambiarEstadoUsuario', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            Consecutivo: consecutivo
        })
    })
        .then(r => r.json())
        .then(data => {

            if (data.success) {

                const fila = boton.closest("tr");
                const badgeEstado = fila.querySelector(".badge.activo, .badge.inactivo");

                boton.classList.toggle("activo");
                boton.classList.toggle("inactivo");

                badgeEstado.classList.toggle("activo");
                badgeEstado.classList.toggle("inactivo");

                badgeEstado.textContent =
                    boton.classList.contains("activo") ? "Activo" : "Inactivo";

            } else {
                alert(data.mensaje);
            }
        });
}

function abrirEditarUsuario(id, cedula, nombre, correo, usuario, rol, estado) {
    document.getElementById("ventanaEditarUsuario").style.display = "flex";

    document.getElementById("editConsecutivo").value = id;
    document.getElementById("editCedula").value = cedula;
    document.getElementById("editNombre").value = nombre;
    document.getElementById("editCorreo").value = correo;
    document.getElementById("editUsuario").value = usuario;
    document.getElementById("editContrasenna").value = "";

    seleccionarRolPorNombre(rol);
}

document.addEventListener("DOMContentLoaded", function () {
    const modalUsuario = document.getElementById("ventanaRegistroUsuario");
    const modalEditar = document.getElementById("ventanaEditarUsuario");

    if (modalUsuario) {
        modalUsuario.addEventListener("click", function (event) {
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

function seleccionarRolPorNombre(nombreRol) {
    const select = document.getElementById("editRol");

    for (let option of select.options) {
        if (option.text.trim() === nombreRol.trim()) {
            select.value = option.value;
            break;
        }
    }
}
function seleccionarEstado(Estado) {
    const select = document.getElementById("editEstado");

    for (let option of select.options) {
        if (option.text.trim() === Estado.trim()) {
            select.value = option.value;
            break;
        }

    }

}
function validarFormulario() {

    var nombre = document.getElementById("NombreCompleto");

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

    const modal = document.querySelector(".modal-contenido-usuario");
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

function limpiarFormularioUsuario() {

    document.getElementById("Cedula").value = "";
    document.getElementById("NombreCompleto").value = "";
    document.getElementById("Correo").value = "";
    document.getElementById("UsuarioLogin").value = "";
    document.getElementById("Contrasenna").value = "";

    const rol = document.getElementById("NombreRol");
    if (rol) rol.selectedIndex = 0;

    document.getElementById("ventanaRegistroUsuario").style.display = "none";
}

const buscarUsuario = document.getElementById("buscarUsuario");

if (buscarUsuario) {

    buscarUsuario.addEventListener("keyup", function () {

        const filtro = this.value.toLowerCase();
        const filas = document.querySelectorAll("#tablaUsuario tbody tr");

        let visibles = 0;

        filas.forEach(function (fila) {

            if (fila.id === "sinResultadosUsuario")
                return;

            const texto = fila.textContent.toLowerCase();

            if (texto.includes(filtro)) {
                fila.style.display = "";
                visibles++;
            } else {
                fila.style.display = "none";
            }

        });

        document.getElementById("sinResultadosUsuario").hidden = visibles > 0;

    });

}