
document.getElementById("Telefono").addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, '');

    if (this.value.length > 8) {
        this.value = this.value.slice(0, 8);
    }
});

    document.querySelector("#formRegistro").addEventListener("submit", function (e) {

        let valido = true;

    const campos = this.querySelectorAll("[required]");

    campos.forEach(campo => {
        if (!campo.value.trim()) {
        campo.classList.add("is-invalid");
    valido = false;
        } else {
        campo.classList.remove("is-invalid");
        }
    });

    if (!valido) {
        e.preventDefault();
    document.getElementById("errorGeneral").style.display = "block";
    }
});


document.querySelectorAll("[required]").forEach(campo => {
        campo.addEventListener("input", function () {
            if (this.value.trim()) {
                this.classList.remove("is-invalid");
            }
        });
});

document.addEventListener("DOMContentLoaded", function () {

    const modalProveedor = document.getElementById("ventanaRegistroProveedor");

    if (modalProveedor) {

        modalProveedor.addEventListener("click", function (event) {

            if (event.target === this) {
                this.style.display = "none";
            }

        });

    }
    document.getElementById("editTelefono").addEventListener("input", function () {

        this.value = this.value.replace(/\D/g, '');

        if (this.value.length > 8) {
            this.value = this.value.slice(0, 8);
        }

    });
});

const modalProveedor = document.getElementById("ventanaRegistroProveedor");

if (modalProveedor) {

    modalProveedor.addEventListener("click", function (event) {

        if (event.target === this) {
            this.style.display = "none";
        }

    });

}
function abrirEditarProveedor(id, nombre, telefono, correo, direccion,estado) {
    document.getElementById("ventanaEditarProveedor").style.display = "flex";

    document.getElementById("editConsecutivo").value = id;
    document.getElementById("editNombre").value = nombre;
    document.getElementById("editTelefono").value = telefono;
    document.getElementById("editCorreo").value = correo;
    document.getElementById("editDireccion").value = direccion;
  

}

document.addEventListener("DOMContentLoaded", function () {
    const modalRegistro = document.getElementById("ventanaRegistroProveedor");
    const modalEditar = document.getElementById("ventanaEditarProveedor");

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

document.addEventListener("DOMContentLoaded", function () {

    const mensaje = document.getElementById("mensajeError");

    if (mensaje) {

        setTimeout(() => {
            mensaje.style.opacity = "0";
            mensaje.style.transition = "0.5s";
        }, 3000);

        setTimeout(() => {
            mensaje.remove();
        }, 3500);

    }

});

const buscarProveedor = document.getElementById("buscarProveedor");

if (buscarProveedor) {

    buscarProveedor.addEventListener("keyup", function () {

        const filtro = this.value.toLowerCase();
        const filas = document.querySelectorAll("#tablaProveedor tbody tr");

        let visibles = 0;

        filas.forEach(function (fila) {

            if (fila.id === "sinResultadosProveedor")
                return;

            const texto = fila.textContent.toLowerCase();

            if (texto.includes(filtro)) {
                fila.style.display = "";
                visibles++;
            } else {
                fila.style.display = "none";
            }

        });

        document.getElementById("sinResultadosProveedor").hidden = visibles > 0;

    });

}

function cambiarEstadoProveedor(boton, consecutivo) {

    fetch('/Proveedor/CambiarEstadoProveedor', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ Consecutivo: consecutivo })
    })
        .then(r => r.json())
        .then(data => {

            if (data.success) {

                const fila = boton.closest("tr");
                const badge = fila.querySelector(".badge");

                boton.classList.toggle("activo");
                boton.classList.toggle("inactivo");

                badge.classList.toggle("activo");
                badge.classList.toggle("inactivo");

                const activo = boton.classList.contains("activo");

                badge.textContent = activo ? "Activo" : "Inactivo";
            }
        });
}