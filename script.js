let charts = {};

function evaluar() {
    try {
        console.log("Iniciando evaluación..."); // Para depuración

        // 1. OBTENER VALORES
        // Verificar que los elementos existan antes de leer su valor
        const getVal = (id) => {
            const el = document.getElementById(id);
            if (!el) throw new Error(`No se encontró el campo con ID: ${id}`);
            return parseFloat(el.value) || 0; // Si está vacío devuelve 0
        };

        const ph = getVal('ph');
        const sst = getVal('sst');
        const aceites = getVal('aceites');
        const cobre = getVal('cobre');
        const hierro = getVal('hierro');
        const zinc = getVal('zinc');
        const arsenico = getVal('arsenico');
        const cadmio = getVal('cadmio');
        const cromo = getVal('cromo');
        const mercurio = getVal('mercurio');
        const cianuro = getVal('cianuro');

        // 2. LÓGICA DE EVALUACIÓN
        let resultados = "=== RESULTADOS DEL ANÁLISIS SEGÚN LMP ===\n\n";

        resultados += "--- Parámetros Físicoquímicos ---\n";
        resultados += (ph >= 6 && ph <= 9) ? "✅ pH adecuado\n" : "⚠️ pH fuera de rango\n";
        resultados += (sst <= 50) ? "✅ SST dentro del límite\n" : "⚠️ SST elevado\n";
        resultados += (aceites <= 20) ? "✅ Aceites y Grasas ok\n" : "⚠️ Aceites y Grasas elevado\n";

        resultados += "\n--- Metales esenciales ---\n";
        resultados += (cobre <= 0.5) ? "✅ Cobre Total ok\n" : "⚠️ Cobre Total elevado\n";
        resultados += (hierro <= 2) ? "✅ Hierro (Disuelto) ok\n" : "⚠️ Hierro (Disuelto) elevado\n";
        resultados += (zinc <= 1.5) ? "✅ Zinc Total ok\n" : "⚠️ Zinc Total alto\n";

        resultados += "\n--- Compuestos Tóxicos ---\n";
        resultados += (arsenico <= 0.1) ? "✅ Arsénico Total ok\n" : "⚠️ Arsénico Total elevado\n";
        resultados += (cadmio <= 0.05) ? "✅ Cadmio Total ok\n" : "⚠️ Cadmio Total elevado\n";
        resultados += (cromo <= 0.1) ? "✅ Cromo Hexavalente ok\n" : "⚠️ Cromo Hexavalente elevado\n";
        resultados += (mercurio <= 0.002) ? "✅ Mercurio Total ok\n" : "⚠️ Mercurio Total elevado\n";
        resultados += (cianuro <= 1) ? "✅ Cianuro Total ok\n" : "⚠️ Cianuro Total elevado\n";

        // Mostrar texto
        const txtOutput = document.getElementById('textResult');
        if(txtOutput) {
            txtOutput.innerText = resultados;
        }

        // 3. GRAFICAR
        actualizarGraficas([ph, sst, aceites, cobre, hierro, zinc, arsenico, cadmio, cromo, mercurio, cianuro]);

    } catch (error) {
        alert("Ocurrió un error: " + error.message);
        console.error(error);
    }
}

function actualizarGraficas(dataValues) {
    // Verificar si Chart.js cargó correctamente
    if (typeof Chart === 'undefined') {
        document.getElementById('textResult').innerText += "\n\n⚠️ Error: No se pudo cargar la librería de gráficas (Chart.js). Verifica tu conexión a internet.";
        return;
    }

    const labels = ["pH", "SST", "Aceites", "Cobre", "Hierro", "Zinc", "As", "Cd", "Cr", "Hg", "CN"];
    
    const commonConfig = (type, label, color, bgColor) => ({
        type: type,
        data: {
            labels: labels,
            datasets: [{
                label: label,
                data: dataValues,
                borderColor: color,
                backgroundColor: bgColor,
                borderWidth: 1,
                pointRadius: 5
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });

    // Destruir gráficas anteriores
    if (charts.bar) charts.bar.destroy();
    if (charts.line) charts.line.destroy();
    if (charts.scatter) charts.scatter.destroy();
    if (charts.hbar) charts.hbar.destroy();

    // Crear nuevas gráficas
    const ctx1 = document.getElementById('chartBar');
    if (ctx1) charts.bar = new Chart(ctx1.getContext('2d'), commonConfig('bar', 'Concentración', '#36A2EB', 'rgba(54, 162, 235, 0.5)'));

    const ctx2 = document.getElementById('chartLine');
    if (ctx2) charts.line = new Chart(ctx2.getContext('2d'), commonConfig('line', 'Tendencia', '#FF9F40', 'rgba(255, 159, 64, 0.5)'));

    const ctx3 = document.getElementById('chartScatter');
    if (ctx3) {
        let scatterConfig = commonConfig('line', 'Dispersión', '#4BC0C0', '#4BC0C0');
        scatterConfig.data.datasets[0].showLine = false; 
        charts.scatter = new Chart(ctx3.getContext('2d'), scatterConfig);
    }

    const ctx4 = document.getElementById('chartHBar');
    if (ctx4) {
        let hBarConfig = commonConfig('bar', 'Comparativa', '#FF6384', 'rgba(255, 99, 132, 0.5)');
        hBarConfig.options.indexAxis = 'y';
        charts.hbar = new Chart(ctx4.getContext('2d'), hBarConfig);
    }
}

// Ejecutar una evaluación inicial al cargar la página
window.onload = function() {
    console.log("Página cargada");
    evaluar();
};
