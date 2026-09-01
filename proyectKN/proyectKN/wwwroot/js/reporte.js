document.addEventListener("DOMContentLoaded", function () {

    const inputDesde = document.getElementById("desde");
    const inputHasta = document.getElementById("hasta");

    if (inputDesde) inputDesde.value = "";
    if (inputHasta) inputHasta.value = "";

    let ultimoTitulo = "Reporte";
    let moduloActual = "contabilidad";
    let datosActuales = [];
    let datosOriginales = [];
    let graficoMensual;



    const configuraciones = {
        contabilidad: {
            titulo: "Reporte de Contabilidad",
            columnas: ["Fecha", "Tipo", "Descripción", "Monto"],
            campos: ["fecha", "tipo", "descripcion", "monto"]
        },
        clientes: {
            titulo: "Reporte de Usuarios",
            columnas: ["Nombre", "Cédula", "Correo", "Usuario", "Rol", "Estado", "Fecha Registro"],
            campos: ["nombreCompleto", "cedula", "correo", "usuarioLogin", "nombreRol", "estado", "fechaRegistro"]
        },
        citas: {
            titulo: "Reporte de Citas",
            columnas: ["Fecha", "Hora", "Cliente", "Cédula", "Servicio", "Estado", "Creada por"],
            campos: ["fechaCita", "horaCita", "nombreCliente", "cedula", "servicio", "estado", "creadaPor"]
        },
        ingresos_vehiculos: {
            titulo: "Reporte de Ingreso de Vehículos",
            columnas: ["Cliente", "Cédula", "Placa", "Marca", "Modelo", "Problema", "Revisión", "Estado", "Fecha Registro"],
            campos: ["nombre_Cliente", "cedula", "placa", "marca", "modelo", "problema", "revision", "estado", "fechaRegistro"]
        },
        inventario: {
            titulo: "Reporte de Inventario",
            columnas: ["Nombre", "Id Artículo", "Descripción", "Precio Compra", "Precio Venta", "Stock", "Stock Mínimo", "Proveedor", "Fecha Registro"],
            campos: ["nombre", "idArticulo", "descripcion", "precioCompra", "precioVenta", "stock", "stockMinimo", "proveedor", "fechaRegistro"]
        },
        proveedores: {
            titulo: "Reporte de Proveedores",
            columnas: ["Nombre", "Teléfono", "Correo", "Dirección", "Estado", "Fecha Registro"],
            campos: ["nombre", "telefono", "correo", "direccion", "estado", "fechaRegistro"]
        }
    };

    window.preset = async function (tipo, estado = "") {

        moduloActual = tipo;

        document.querySelectorAll(".modulo-card").forEach(function (boton) {
            boton.classList.toggle("active", boton.dataset.modulo === tipo);
        });

        const desde = document.getElementById("desde")?.value || "";
        const hasta = document.getElementById("hasta")?.value || "";

        const config = configuraciones[tipo];

        if (!config) {
            alert("No existe configuración para este reporte: " + tipo);
            return;
        }

        document.getElementById("reportTitle").textContent = config.titulo;
        ultimoTitulo = config.titulo;

        try {

            let url = `/Reporteria/ObtenerReporte?tipo=${encodeURIComponent(tipo)}`;

            if (desde) {
                url += `&desde=${encodeURIComponent(desde)}`;
            }

            if (hasta) {
                url += `&hasta=${encodeURIComponent(hasta)}`;
            }

            if (estado !== "") {
                url += `&estado=${encodeURIComponent(estado)}`;
            }

            const response = await fetch(url);

            let data = [];

            if (response.ok) {
                data = await response.json();
            } else {
                console.warn(
                    "Sin datos o error al consultar el reporte:",
                    await response.text()
                );
            }

            datosActuales = data;
            datosOriginales = data;

            generarTabla(tipo, data);
            actualizarTitulos();
            actualizarGraficos();
            renderResumen(tipo, data);

            if (tipo === "contabilidad") {
                actualizarResumenContabilidad(data);
            }

            if (tipo === "ingresos_vehiculos") {
                actualizarResumenVehiculos(data);
            }

        } catch (error) {

            console.error(error);

            datosActuales = [];
            datosOriginales = [];

            generarTabla(tipo, []);
            actualizarTitulos();

        } finally {

            document
                .querySelector(".reporteria-container")
                ?.classList.add("reporteria-ready");
        }
    };
    function generarTabla(tipo, data) {
        const config = configuraciones[tipo];
        const thead = document.getElementById("reportHead");
        const tbody = document.getElementById("reportBody");

        thead.innerHTML = "";
        tbody.innerHTML = "";

        const trHead = document.createElement("tr");

        config.columnas.forEach(columna => {
            const th = document.createElement("th");
            th.textContent = columna;
            trHead.appendChild(th);
        });

        thead.appendChild(trHead);

        if (!data || data.length === 0) {
            const tr = document.createElement("tr");
            const td = document.createElement("td");

            td.colSpan = config.columnas.length;
            td.textContent = "No hay datos para este reporte";

            tr.appendChild(td);
            tbody.appendChild(tr);
            reiniciarPaginacionReporte();
            return;
        }

        data.forEach(item => {
            const tr = document.createElement("tr");

            config.campos.forEach(campo => {
                const td = document.createElement("td");
                td.textContent = formatearValor(item[campo], campo);
                tr.appendChild(td);
            });

            tbody.appendChild(tr);
        });
        reiniciarPaginacionReporte();
    }

    function formatearValor(valor, campo) {
        if (valor === null || valor === undefined) return "";

        const campoLower = campo.toLowerCase();

        if (campoLower.includes("fecha")) {
            const fecha = new Date(valor);

            if (!isNaN(fecha)) {
                return fecha.toLocaleDateString("es-CR");
            }
        }

        if (campoLower.includes("hora")) {
            return valor;
        }

        if (
            campoLower === "monto" ||
            campoLower === "preciocompra" ||
            campoLower === "precioventa"
        ) {
            const numero = Number(valor);

            if (!isNaN(numero)) {
                return formatoMoneda(numero);
            }
        }

        return valor;
    }

    function formatoMoneda(valor) {
        return new Intl.NumberFormat("es-CR", {
            style: "currency",
            currency: "CRC",
            maximumFractionDigits: 0
        }).format(valor);
    }

    function actualizarTitulos() {
        const nombres = {
            contabilidad: "Reporte de ingresos y egresos",
            clientes: "Reporte de usuarios",
            citas: "Reporte de citas",
            ingresos_vehiculos: "Reporte de vehículos",
            inventario: "Reporte de inventario",
            proveedores: "Reporte de proveedores"
        };

        const titulo = document.getElementById("reportTitle");
        const descripcion = document.getElementById("reportDescription");

        if (titulo) {
            titulo.innerText = nombres[moduloActual] || "Reporte";
        }

        if (descripcion) {
            descripcion.innerText = `Mostrando ${datosActuales.length} registro(s)`;
        }
    }

    function actualizarResumenContabilidad(data) {
        let totalIngresos = 0;
        let totalEgresos = 0;

        data.forEach(item => {
            if (item.tipo && item.tipo.toLowerCase().includes("ingreso")) {
                totalIngresos += Number(item.monto || 0);
            }

            if (item.tipo && item.tipo.toLowerCase().includes("egreso")) {
                totalEgresos += Number(item.monto || 0);
            }
        });

        const totalIngresosLabel = document.getElementById("totalIngresos");
        const totalEgresosLabel = document.getElementById("totalEgresos");

        if (totalIngresosLabel) totalIngresosLabel.textContent = formatoMoneda(totalIngresos);
        if (totalEgresosLabel) totalEgresosLabel.textContent = formatoMoneda(totalEgresos);
    }

    async function cargarResumenIngresos() {
        const desde = document.getElementById("desde")?.value || "";
        const hasta = document.getElementById("hasta")?.value || "";

        try {
            let url = `/Reporteria/ObtenerReporte?tipo=contabilidad`;

            if (desde) url += `&desde=${encodeURIComponent(desde)}`;
            if (hasta) url += `&hasta=${encodeURIComponent(hasta)}`;

            const response = await fetch(url);

            if (!response.ok) {
                console.error(await response.text());
                return;
            }

            const data = await response.json();

            let totalIngresos = 0;
            let totalEgresos = 0;

            data.forEach(item => {
                if (item.tipo && item.tipo.toLowerCase().includes("ingreso")) {
                    totalIngresos += Number(item.monto || 0);
                }

                if (item.tipo && item.tipo.toLowerCase().includes("egreso")) {
                    totalEgresos += Number(item.monto || 0);
                }
            });

            const totalIngresosLabel = document.getElementById("totalIngresos");
            const totalEgresosLabel = document.getElementById("totalEgresos");

            if (totalIngresosLabel) totalIngresosLabel.textContent = formatoMoneda(totalIngresos);
            if (totalEgresosLabel) totalEgresosLabel.textContent = formatoMoneda(totalEgresos);

        } catch (error) {
            console.error("Error en resumen de ingresos:", error);
        }
    }

    async function cargarResumenCitas() {
        const desde = document.getElementById("desde")?.value || "";
        const hasta = document.getElementById("hasta")?.value || "";

        try {
            let url = `/Reporteria/ObtenerResumenCitas`;

            if (desde || hasta) {
                url += "?";

                if (desde) {
                    url += `desde=${encodeURIComponent(desde)}`;
                }

                if (hasta) {
                    if (desde) url += "&";
                    url += `hasta=${encodeURIComponent(hasta)}`;
                }
            }

            const response = await fetch(url);

            if (!response.ok) {
                console.error(await response.text());
                return;
            }

            const data = await response.json();

            // SOLO CITAS CONFIRMADAS
            const confirmadasCard = document.querySelector("[onclick*='Confirmada']");

            if (confirmadasCard) {
                const strong = confirmadasCard.querySelector("strong");

                if (strong) {
                    strong.textContent = data.confirmadas ?? 0;
                }
            }

            // Total de citas confirmadas
            const totalCitas = document.getElementById("totalCitas");

            if (totalCitas) {
                totalCitas.textContent = data.confirmadas ?? 0;
            }

        } catch (error) {
            console.error("Error en resumen de citas:", error);
        }
    }

    function actualizarGraficos() {

        const ctx = document.getElementById("graficoMensual");

        if (!ctx) return;

        if (graficoMensual) {
            graficoMensual.destroy();
        }

        let labels = [];
        let valores = [];
        let tipoGrafico = "bar";
        let titulo = "";

        switch (moduloActual) {

            // ================= CONTABILIDAD =================

            case "contabilidad":

                tipoGrafico = "line";

                let ingresos = [];
                let egresos = [];

                datosActuales.forEach(item => {

                    if (item.tipo?.toLowerCase().includes("ingreso"))
                        ingresos.push(item);

                    if (item.tipo?.toLowerCase().includes("egreso"))
                        egresos.push(item);

                });

                const mensual = obtenerMensual(ingresos, egresos);

                graficoMensual = new Chart(ctx, {
                    type: "line",
                    data: {
                        labels: mensual.meses,
                        datasets: [
                            {
                                label: "Ingresos",
                                data: mensual.ingresos,
                                borderColor: "#16a34a",
                                backgroundColor: "rgba(22,163,74,.15)",
                                fill: true,
                                tension: .35
                            },
                            {
                                label: "Egresos",
                                data: mensual.egresos,
                                borderColor: "#dc2626",
                                backgroundColor: "rgba(220,38,38,.15)",
                                fill: true,
                                tension: .35
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false
                    }
                });

                return;


            // ================= CLIENTES =================

            case "clientes":

                titulo = "Usuarios";

                labels = ["Activos", "Inactivos"];

                valores = [

                    datosActuales.filter(x => x.estado?.toLowerCase() === "activo").length,
                    datosActuales.filter(x => x.estado?.toLowerCase() === "inactivo").length

                ];

                break;


            // ================= CITAS =================

            case "citas":

                titulo = "Citas";

                labels = ["Confirmadas", "Canceladas", "Finalizadas"];

                valores = [

                    datosActuales.filter(x => x.estado?.toLowerCase() === "confirmada").length,
                    datosActuales.filter(x => x.estado?.toLowerCase() === "cancelada").length,
                    datosActuales.filter(x => x.estado?.toLowerCase() === "finalizada").length

                ];

                break;


            // ================= VEHICULOS =================

            case "ingresos_vehiculos":

                titulo = "Vehículos";

                labels = ["Ingresados", "Reparando", "Revisados"];

                valores = [

                    datosActuales.filter(x => x.estado?.toLowerCase() === "ingresado").length,
                    datosActuales.filter(x => x.estado?.toLowerCase() === "reparando").length,
                    datosActuales.filter(x => x.estado?.toLowerCase() === "revisado").length

                ];

                break;


            // ================= INVENTARIO =================

            case "inventario":

                titulo = "Inventario";

                labels = ["Disponible", "Stock bajo"];

                valores = [

                    datosActuales.filter(x => Number(x.stock) > Number(x.stockMinimo)).length,
                    datosActuales.filter(x => Number(x.stock) <= Number(x.stockMinimo)).length

                ];

                break;


            // ================= PROVEEDORES =================

            case "proveedores":

                titulo = "Proveedores";

                labels = ["Activos", "Inactivos"];

                valores = [
                    datosActuales.filter(x => x.estado?.toLowerCase() === "activo").length,
                    datosActuales.filter(x => x.estado?.toLowerCase() === "inactivo").length
                ];

                console.log(valores);

                break;

        }


        graficoMensual = new Chart(ctx, {

            type: "bar",

            data: {

                labels: labels,

                datasets: [

                    {

                        label: titulo,
                        data: valores,
                        borderWidth: 1

                    }

                ]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                scales: {

                    y: {

                        beginAtZero: true,
                        ticks: {
                            precision: 0
                        }

                    }

                }

            }

        });

    }

    function obtenerMensual(ingresos, egresos) {
        const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

        const totalIngresos = Array(12).fill(0);
        const totalEgresos = Array(12).fill(0);

        ingresos.forEach(item => {
            const fecha = item.fecha;
            if (!fecha) return;

            const d = new Date(fecha);
            if (isNaN(d)) return;

            totalIngresos[d.getMonth()] += Number(item.monto || 0);
        });

        egresos.forEach(item => {
            const fecha = item.fecha;
            if (!fecha) return;

            const d = new Date(fecha);
            if (isNaN(d)) return;

            totalEgresos[d.getMonth()] += Number(item.monto || 0);
        });

        return {
            meses,
            ingresos: totalIngresos,
            egresos: totalEgresos
        };
    }
    //excel exportar
    function formatoMonedaPDF(valor) {
        const numero = Number(valor) || 0;
        return "C" + numero.toLocaleString("es-CR", { maximumFractionDigits: 0 });

    }
    window.exportTable = async function () {

        const config = configuraciones[moduloActual];
        if (!config) return;

        if (!datosActuales.length) {
            Swal.fire({
                icon: "warning",
                title: "Sin datos",
                text: "No hay datos para exportar.",
                confirmButtonColor: "#2563eb"
            });
            return;
        }

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet(config.titulo.substring(0, 31));

        const totalColumnas = config.columnas.length;

        // Título //
        sheet.mergeCells(1, 1, 1, totalColumnas);
        const celdaTitulo = sheet.getCell(1, 1);
        celdaTitulo.value = ultimoTitulo;
        celdaTitulo.font = { bold: true, size: 16, color: { argb: "FFFFFFFF" } };
        celdaTitulo.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF111827" } };
        celdaTitulo.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
        sheet.getRow(1).height = 28;

        //  Periodo //
        sheet.mergeCells(2, 1, 2, totalColumnas);
        const celdaPeriodo = sheet.getCell(2, 1);
        celdaPeriodo.value = `Periodo: ${obtenerPeriodoTexto()}`;
        celdaPeriodo.font = { size: 11, color: { argb: "FFFFFFFF" } };
        celdaPeriodo.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF111827" } };
        celdaPeriodo.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
        sheet.getRow(2).height = 20;

        // Generado //
        sheet.mergeCells(3, 1, 3, totalColumnas);
        const celdaGenerado = sheet.getCell(3, 1);
        celdaGenerado.value = `Generado: ${new Date().toLocaleDateString("es-CR")} ${new Date().toLocaleTimeString("es-CR")}`;
        celdaGenerado.font = { size: 11, color: { argb: "FFFFFFFF" } };
        celdaGenerado.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF111827" } };
        celdaGenerado.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
        sheet.getRow(3).height = 20;

        //  Total de registros//
        sheet.mergeCells(4, 1, 4, totalColumnas);
        const celdaRegistros = sheet.getCell(4, 1);
        celdaRegistros.value = `Registros exportados: ${datosActuales.length}`;
        celdaRegistros.font = { size: 11, color: { argb: "FFFFFFFF" } };
        celdaRegistros.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF111827" } };
        celdaRegistros.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
        sheet.getRow(4).height = 20;


        sheet.getRow(5).height = 8;

        //  Encabezados//
        const headerRow = sheet.getRow(6);

        config.columnas.forEach((col, i) => {
            const cell = headerRow.getCell(i + 1);
            cell.value = col;
            cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
            cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF2563EB" } };
            cell.alignment = { vertical: "middle", horizontal: "center" };
            cell.border = {
                top: { style: "thin" }, left: { style: "thin" },
                bottom: { style: "thin" }, right: { style: "thin" }
            };
        });
        headerRow.height = 24;

        -
            config.columnas.forEach((col, i) => {
                sheet.getColumn(i + 1).width = Math.max(col.length + 5, 15);
            });


        const camposMoneda = ["monto", "preciocompra", "precioventa"];

        datosActuales.forEach((item, index) => {
            const rowValues = config.campos.map(campo => formatearValorExcel(item[campo], campo));
            const row = sheet.addRow(rowValues);

            const colorFondo = index % 2 === 0 ? "FFF8FAFC" : "FFFFFFFF";

            row.eachCell((cell, colNumber) => {
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: colorFondo } };
                cell.border = {
                    top: { style: "thin", color: { argb: "FFE2E8F0" } },
                    left: { style: "thin", color: { argb: "FFE2E8F0" } },
                    bottom: { style: "thin", color: { argb: "FFE2E8F0" } },
                    right: { style: "thin", color: { argb: "FFE2E8F0" } }
                };
                cell.alignment = { vertical: "middle" };

                const campo = config.campos[colNumber - 1];


                if (moduloActual === "contabilidad" && campo === "tipo") {
                    const valor = String(item.tipo || "").toLowerCase();
                    if (valor.includes("ingreso")) cell.font = { color: { argb: "FF16A34A" } };
                    if (valor.includes("egreso")) cell.font = { color: { argb: "FFDC2626" } };
                }

                // formato de moneda //
                if (camposMoneda.includes(campo?.toLowerCase())) {
                    cell.numFmt = '"₡"#,##0';
                    cell.alignment = { vertical: "middle", horizontal: "right" };
                }
            });
        });


        sheet.views = [{ state: "frozen", ySplit: 6 }];

        sheet.autoFilter = {
            from: { row: 6, column: 1 },
            to: { row: 6, column: totalColumnas }
        };

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: "application/octet-stream" });
        saveAs(blob, `${obtenerNombreArchivo()}.xlsx`);
    };

    function formatearValorExcel(valor, campo) {
        if (valor === null || valor === undefined) return "";

        const campoLower = campo.toLowerCase();

        if (campoLower.includes("fecha")) {
            const fecha = new Date(valor);
            if (!isNaN(fecha)) {
                return fecha.toLocaleDateString("es-CR");
            }
        }

        if (campoLower === "monto" || campoLower === "preciocompra" || campoLower === "precioventa") {
            const numero = Number(valor);
            if (!isNaN(numero)) return numero;
        }

        return valor;
    }
    function obtenerPeriodoTexto() {
        const desde = document.getElementById("desde")?.value;
        const hasta = document.getElementById("hasta")?.value;

        if (!desde && !hasta) return "Todos los registros";

        const formato = (f) => f ? new Date(f).toLocaleDateString("es-CR") : "—";
        return `${formato(desde)} al ${formato(hasta)}`;
    }

    function obtenerNombreArchivo() {
        const fecha = new Date().toISOString().split("T")[0];
        return `${ultimoTitulo.replace(/\s+/g, "_")}_${fecha}`;
    }

    //PDF
    let fontBase64Cache = null;

    async function cargarFuenteColones(doc) {
        if (!fontBase64Cache) {
            const response = await fetch(
                "https://raw.githubusercontent.com/openmaptiles/fonts/master/noto-sans/NotoSans-Regular.ttf"
            );
            const buffer = await response.arrayBuffer();
            fontBase64Cache = arrayBufferABase64(buffer);
        }

        doc.addFileToVFS("NotoSans-Regular.ttf", fontBase64Cache);
        doc.addFont("NotoSans-Regular.ttf", "NotoSans", "normal");
    }

    function arrayBufferABase64(buffer) {
        let binary = "";
        const bytes = new Uint8Array(buffer);
        const chunkSize = 0x8000;

        for (let i = 0; i < bytes.length; i += chunkSize) {
            binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSize));
        }

        return btoa(binary);
    }

    function formatoMonedaPDF(valor) {
        const numero = Number(valor) || 0;
        return "₡ " + numero.toLocaleString("es-CR", { maximumFractionDigits: 0 });
    }
    window.exportPDF = async function () {

        if (!datosActuales.length) {
            Swal.fire({
                icon: "warning",
                title: "Sin datos",
                text: "No hay datos para exportar.",
                confirmButtonColor: "#2563eb"
            });
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF("landscape", "mm", "a4");


        try {
            await cargarFuenteColones(doc);
            doc.setFont("NotoSans", "normal");
        } catch (error) {
            console.warn("No se pudo cargar la fuente NotoSans, usando helvetica:", error);
            doc.setFont("helvetica", "normal");
        }

        const config = configuraciones[moduloActual];
        const columnas = config.columnas;
        const campos = config.campos;
        const camposMoneda = ["monto", "precioCompra", "precioVenta"];

        const pageWidth = doc.internal.pageSize.getWidth();


        doc.setFillColor(17, 24, 39);
        doc.rect(0, 0, pageWidth, 22, "F");

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(16);
        doc.text(ultimoTitulo, 14, 13);

        doc.setFontSize(9);
        doc.text(`Periodo: ${obtenerPeriodoTexto()}`, 14, 19);

        doc.text(
            `Generado: ${new Date().toLocaleDateString("es-CR")} ${new Date().toLocaleTimeString("es-CR")}`,
            pageWidth - 14, 13, { align: "right" }
        );
        doc.text(`Registros: ${datosActuales.length}`, pageWidth - 14, 19, { align: "right" });


        const body = datosActuales.map(item =>
            campos.map(campo => {
                if (camposMoneda.includes(campo)) {
                    return formatoMonedaPDF(item[campo]);
                }
                return formatearValor(item[campo], campo);
            })
        );

        const columnStyles = {};
        campos.forEach((campo, i) => {
            if (camposMoneda.includes(campo)) {
                columnStyles[i] = { halign: "right", cellWidth: 32 };
            }
            if (["descripcion", "problema", "revision"].includes(campo)) {
                columnStyles[i] = { ...columnStyles[i], cellWidth: 42 };
            }
        });

        doc.autoTable({
            head: [columnas],
            body: body,
            startY: 28,
            tableWidth: "auto",
            margin: { left: 14, right: 14 },
            styles: {
                font: "NotoSans",
                fontStyle: "normal",
                fontSize: 9,
                textColor: [17, 24, 39],
                lineColor: [229, 231, 235],
                lineWidth: 0.1,
                cellPadding: 3,
                valign: "middle",
                overflow: "linebreak"
            },
            headStyles: {
                font: "NotoSans",
                fontStyle: "normal",
                fillColor: [37, 99, 235],
                textColor: [255, 255, 255],
                halign: "center"
            },
            alternateRowStyles: {
                fillColor: [249, 250, 251]
            },
            columnStyles: columnStyles,

            didParseCell: function (data) {
                if (moduloActual === "contabilidad" && data.section === "body") {
                    const colTipo = campos.indexOf("tipo");
                    if (colTipo === -1) return;

                    const valorTipo = String(body[data.row.index][colTipo] || "").toLowerCase();

                    if (valorTipo.includes("ingreso")) {
                        data.cell.styles.textColor = [22, 163, 74];
                    } else if (valorTipo.includes("egreso")) {
                        data.cell.styles.textColor = [220, 38, 38];
                    }
                }
            },

            didDrawPage: function () {
                const pageHeight = doc.internal.pageSize.getHeight();
                doc.setFont("NotoSans", "normal");
                doc.setFontSize(8);
                doc.setTextColor(107, 114, 128);
                doc.text(`Página ${doc.internal.getNumberOfPages()}`, pageWidth - 14, pageHeight - 8, { align: "right" });
                doc.text("Sistema de Reportes Taller La Union", 14, pageHeight - 8);
            }
        });

        doc.save(`${obtenerNombreArchivo()}.pdf`);
    };
    window.filtrarResumenCitas = function (estado) {
        preset("citas", estado);
    };

    document.getElementById("desde")?.addEventListener("change", function () {
        cargarResumenCitas();
        cargarResumenIngresos();

        if (moduloActual) {
            preset(moduloActual);
        }
    });

    document.getElementById("hasta")?.addEventListener("change", function () {
        cargarResumenCitas();
        cargarResumenIngresos();

        if (moduloActual) {
            preset(moduloActual);
        }
    });

    preset("contabilidad");

    cargarResumenCitas();
    cargarResumenVehiculos();
    function renderResumen(tipo, data) {

        const contenedor = document.getElementById("filtrosCards");
        if (!contenedor) return;

        const titulo = document.getElementById("filtroTitulo");
        const descripcion = document.getElementById("filtroDescripcion");

        switch (tipo) {

            case "contabilidad":
                titulo.textContent = "Resumen de contabilidad";
                descripcion.textContent = "Seleccione un tipo para ver el reporte";
                break;

            case "clientes":
                titulo.textContent = "Resumen de usuarios";
                descripcion.textContent = "Seleccione un estado para ver el reporte";
                break;

            case "citas":
                titulo.textContent = "Resumen de citas";
                descripcion.textContent = "Seleccione un estado para ver el reporte";
                break;

            case "ingresos_vehiculos":
                titulo.textContent = "Resumen de vehículos";
                descripcion.textContent = "Seleccione un estado para ver el reporte";
                break;

            case "inventario":
                titulo.textContent = "Resumen de inventario";
                descripcion.textContent = "Seleccione una categoría para ver el reporte";
                break;

            case "proveedores":
                titulo.textContent = "Resumen de proveedores";
                descripcion.textContent = "Seleccione un estado para ver el reporte";
                break;
        }



        contenedor.innerHTML = "";

        let resumen = [];

        switch (tipo) {

            case "contabilidad":
                resumen = [
                    { label: "Todos", value: data.length, clase: "todos" },
                    { label: "Ingresos", value: data.filter(x => x.tipo?.toLowerCase().includes("ingreso")).length, clase: "ingreso" },
                    { label: "Egresos", value: data.filter(x => x.tipo?.toLowerCase().includes("egreso")).length, clase: "egreso" }
                ];
                break;

            case "clientes":
                resumen = [
                    { label: "Todos", value: data.length, clase: "todos" },
                    { label: "Activos", value: data.filter(x => x.estado?.toLowerCase() === "activo").length, clase: "activo" },
                    { label: "Inactivos", value: data.filter(x => x.estado?.toLowerCase() === "inactivo").length, clase: "inactivo" }
                ];
                break;

            case "citas":
                resumen = [
                    { label: "Todas", value: data.length, clase: "todos" },
                    { label: "Confirmada", value: data.filter(x => x.estado?.toLowerCase() === "confirmada").length, clase: "confirmada" },
                    { label: "Canceladas", value: data.filter(x => x.estado?.toLowerCase() === "cancelada").length, clase: "cancelada" },
                    { label: "Finalizadas", value: data.filter(x => x.estado?.toLowerCase() === "finalizada").length, clase: "finalizada" },

                ];
                break;

            case "ingresos_vehiculos":
                resumen = [
                    { label: "Todos", value: data.length, clase: "todos" },
                    { label: "Ingresados", value: data.filter(x => x.estado?.toLowerCase() === "ingresado").length, clase: "ingresado" },
                    { label: "En revisión", value: data.filter(x => x.estado?.toLowerCase().includes("reparando")).length, clase: "reparando" },
                    { label: "Revisados", value: data.filter(x => x.estado?.toLowerCase() === "revisado").length, clase: "revisado" }
                ];
                break;

            case "inventario":
                resumen = [
                    { label: "Todos", value: data.length, clase: "todos" },
                    { label: "Disponibles", value: data.filter(x => Number(x.stock) > Number(x.stockMinimo)).length, clase: "disponible" },
                    { label: "Stock bajo", value: data.filter(x => Number(x.stock) <= Number(x.stockMinimo)).length, clase: "stockbajo" }
                ];
                break;

            case "proveedores":
                resumen = [
                    { label: "Todos", value: data.length, clase: "todos" },
                    { label: "Activos", value: data.filter(x => x.estado?.toLowerCase() === "activo").length, clase: "activo" },
                    { label: "Inactivos", value: data.filter(x => x.estado?.toLowerCase() === "inactivo").length, clase: "inactivo" }
                ];
                break;
        }

        resumen.forEach(r => {

            const div = document.createElement("div");

            div.className = `resumen-card ${r.clase}`;
            div.style.cursor = "pointer";

            div.innerHTML = `
        <div>
            <span>${r.label}</span>
            <strong>${r.value}</strong>
        </div>
    `;


            div.addEventListener("click", function () {

                // Quitar selección de todas las tarjetas
                document.querySelectorAll("#filtrosCards .resumen-card").forEach(card => {
                    card.classList.remove("active");
                });

                // Marcar solamente la tarjeta seleccionada
                this.classList.add("active");

                // Aplicar el filtro
                aplicarFiltroTarjeta(tipo, r.label);
            });


            contenedor.appendChild(div);

            if (r.label === "Todos" || r.label === "Todas") {
                div.classList.add("active");
            }

        });
    }

    function aplicarFiltroTarjeta(tipo, tarjeta) {

        if (tarjeta === "Todos" || tarjeta === "Todas") {

            preset(tipo);
            return;

        }


        const estado = tarjeta;


        if (tipo === "citas") {

            let estadoFiltro = estado.toLowerCase();

            if (estadoFiltro === "confirmadas") {
                estadoFiltro = "confirmada";
            }

            if (estadoFiltro === "canceladas") {
                estadoFiltro = "cancelada";
            }

            if (estadoFiltro === "finalizadas") {
                estadoFiltro = "finalizada";
            }

            const filtrados = datosOriginales.filter(item =>
                item.estado?.toLowerCase() === estadoFiltro
            );

            generarTabla(tipo, filtrados);
            actualizarTitulos();

            return;
        }


        const filtrados = datosOriginales.filter(item => {

            console.log("TIPO:", tipo);
            console.log("TARJETA:", estado);
            console.log("ITEM:", item);
            console.log("ESTADO:", item.estado);
            switch (tipo) {


                case "contabilidad":

                    if (estado === "Ingresos") {
                        return item.tipo?.toLowerCase().includes("ingreso");
                    }

                    if (estado === "Egresos") {
                        return item.tipo?.toLowerCase().includes("egreso");
                    }

                    break;



                case "clientes":

                case "proveedores":

                    return item.estado?.toLowerCase() === estado.toLowerCase().replace("s", "");


                case "ingresos_vehiculos":

                    const estadoReal = item.estado?.toLowerCase();

                    if (estado === "Ingresados") {
                        return estadoReal === "ingresado";
                    }


                    if (estado === "En revisión") {
                        return estadoReal === "reparando";
                    }


                    if (estado === "Revisados") {
                        return estadoReal === "revisado";
                    }

                    break;


                case "inventario":

                    if (estado === "Stock bajo") {

                        return Number(item.stock) <= Number(item.stockMinimo);

                    }


                    if (estado === "Disponibles") {

                        return Number(item.stock) > Number(item.stockMinimo);

                    }

                    break;

            }


            return true;

        });


        generarTabla(tipo, filtrados);



        actualizarTitulos();

    }
    function filtrarTarjeta(tipo, estado) {


        if (estado === "") {
            preset(tipo);
            return;
        }


        preset(tipo, estado);

    }

    function actualizarResumenVehiculos(data) {

        const lbl = document.getElementById("totalVehiculos");

        if (lbl) {
            lbl.textContent = data.length;
        }

    }
    async function cargarResumenVehiculos() {

        try {

            const response = await fetch("/Reporteria/ObtenerReporte?tipo=ingresos_vehiculos");

            if (!response.ok) return;

            const data = await response.json();

            const totalVehiculos = document.getElementById("totalVehiculos");

            if (totalVehiculos) {
                totalVehiculos.textContent = data.length;
            }

        } catch (error) {
            console.error("Error cargando resumen de vehículos:", error);
        }
    }

});

function validarRangoFechas() {

    const fechaInicio = document.getElementById("desde");
    const fechaFin = document.getElementById("hasta");

    if (!fechaInicio || !fechaFin) return;

    if (!fechaInicio.value) return;

    // impedir que fin sea menor que inicio
    fechaFin.min = fechaInicio.value;

    if (fechaFin.value && fechaFin.value < fechaInicio.value) {

        Swal.fire({
            icon: "warning",
            title: "Rango Inválido",
            background: "#ffffff",
            text: "La fecha de inicio no puede ser mayor a la fecha fin ",
            color: "#000000",
            confirmButtonColor: "#2563eb"
        });
        fechaFin.value = "";
    }
}
s