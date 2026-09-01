async function consultarVehiculo(event) {

    event.preventDefault();

    const placa = document.getElementById("placa").value;
    const mensaje = document.getElementById("vehicleMessage");

    mensaje.textContent = "";
    mensaje.classList.remove("error");

    const response = await fetch(`/Vehiculo/BuscarVehiculo?placa=${placa}`);



    if (!response.ok) {

        mensaje.textContent = "No se encontró ningún vehículo registrado con esa placa.";
        mensaje.classList.add("error");

        setTimeout(() => {
            mensaje.classList.remove("error");

            setTimeout(() => {
                mensaje.textContent = "";
            }, 300); 
        }, 3000);

        return;
    }

    const data = await response.json();

    document.getElementById("mPlaca").innerText = data.placa;
    document.getElementById("mMarca").innerText = data.marca;
    document.getElementById("mModelo").innerText = data.modelo;
    document.getElementById("mAnio").innerText = data.anio;
    document.getElementById("mEstado").innerText = data.estado;
    document.getElementById("mProblema").innerText = data.problema;

    document.getElementById("modalVehiculo").style.display = "flex";
}

function cerrarModal() {
    document.getElementById("modalVehiculo").style.display = "none";
}