function validarIngreso() {
    let monto = parseFloat(document.getElementById("Monto").value) || 0;
    let deuda = parseFloat(document.getElementById("Saldo_Pendiente").value) || 0;

    let estadoHidden = document.getElementById("Estado");

    if (monto > deuda && deuda > 0) {
        alert("El monto no puede ser mayor que la deuda.");
        document.getElementById("Monto").value = deuda;
        monto = deuda;
    }

    if (!estadoHidden) return;

    if (monto === deuda && deuda > 0) {
        estadoHidden.value = 11; // Pagado
    }
    else if (monto < deuda && monto > 0) {
        estadoHidden.value = 10; // Pendiente
    }
    else {
        estadoHidden.value = "";
    }
}