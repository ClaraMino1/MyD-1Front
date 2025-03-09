async function fetchData() {
    const isbn = document.getElementById('isbn').value.trim();
    const format = document.getElementById('format').value;
    const pais = document.getElementById('pais').value;
    const mesInicioInput = document.getElementById('mesInicio').value;
    const mesFinInput = document.getElementById('mesFin').value;
    const errorMessage = document.querySelector('.error-message');
    const table = document.querySelector('.data-table');
    const tableBody = table.querySelector('tbody');
    const thead = table.querySelector('thead');
    const loadingIndicator = document.querySelector('.loading-indicator');

    errorMessage.style.display = 'none';
    table.style.display = 'none';
    tableBody.innerHTML = '';
    loadingIndicator.style.display = 'block';

    if (!isbn) {
        loadingIndicator.style.display = 'none';
        errorMessage.textContent = 'Por favor, ingresa un ISBN.';
        errorMessage.style.display = 'block';
        return;
    }

    if (mesInicioInput && mesFinInput && mesInicioInput > mesFinInput) {
        loadingIndicator.style.display = 'none';
        errorMessage.textContent = 'El mes de inicio no puede ser posterior al mes de fin.';
        errorMessage.style.display = 'block';
        return;
    }

    try {
        let mesInicio = '';
        let mesFin = '';

        if (mesInicioInput) {
            const [year, month] = mesInicioInput.split('-');
            const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
            mesInicio = `${meses[parseInt(month) - 1]} ${year}`;
        }

        if (mesFinInput) {
            const [year, month] = mesFinInput.split('-');
            const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
            mesFin = `${meses[parseInt(month) - 1]} ${year}`;
        }

        let url = `https://mydback.onrender.com/readExcelByISBN?isbn=${isbn}`;
        /*let url = `http://localhost:8888/readExcelByISBN?isbn=${isbn}`;---PARA LOCAL----*/
        if (mesInicio) url += `&mesInicio=${mesInicio}`;
        if (mesFin) url += `&mesFin=${mesFin}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error('No se pudo obtener la información del servidor');

        const data = await response.json();
        if (!data || data.error) {
            errorMessage.textContent = data.error || 'ERROR: El ISBN ingresado no existe.';
            errorMessage.style.display = 'block';
            return;
        }

        let ventas = calcularVentas(data, format, pais, mesInicio, mesFin);

        thead.innerHTML = `<tr><th>Título</th><th>${obtenerEncabezado(format, pais)}</th></tr>`;
        tableBody.innerHTML = `<tr><td>${data.titulo}</td><td>${ventas}</td></tr>`;
        table.style.display = 'table';
    } catch (error) {
        errorMessage.textContent = 'Error al obtener los datos: ' + error.message;
        errorMessage.style.display = 'block';
    } finally {
        loadingIndicator.style.display = 'none';
    }
}

function calcularVentas(data, format, pais, mesInicio, mesFin) {
    let total = 0;
    if (mesInicio && mesFin) {
        // Lógica para rango de meses
        if (format === 'fisico') {
            if (pais === 'argentina') total = data.fisicoArgentina;
            else if (pais === 'extranjero') total = data.fisicoExtranjero;
            else total = data.fisicoArgentina + data.fisicoExtranjero;
        } else if (format === 'digital') {
            if (pais === 'argentina') total = data.digitalArgentina;
            else if (pais === 'extranjero') total = data.digitalExtranjero;
            else total = data.digitalArgentina + data.digitalExtranjero;
        } else {
            if (pais === 'argentina') total = data.fisicoArgentina + data.digitalArgentina;
            else if (pais === 'extranjero') total = data.fisicoExtranjero + data.digitalExtranjero;
            else total = data.fisicoArgentina + data.fisicoExtranjero + data.digitalArgentina + data.digitalExtranjero;
        }
    } else if (mesInicio) {
        // Lógica para un mes específico
        if (format === 'fisico') {
            if (pais === 'argentina') total = data.fisicoArgentina;
            else if (pais === 'extranjero') total = data.fisicoExtranjero;
            else total = data.fisicoArgentina + data.fisicoExtranjero;
        } else if (format === 'digital') {
            if (pais === 'argentina') total = data.digitalArgentina;
            else if (pais === 'extranjero') total = data.digitalExtranjero;
            else total = data.digitalArgentina + data.digitalExtranjero;
        } else {
            if (pais === 'argentina') total = data.fisicoArgentina + data.digitalArgentina;
            else if (pais === 'extranjero') total = data.fisicoExtranjero + data.digitalExtranjero;
            else total = data.fisicoArgentina + data.fisicoExtranjero + data.digitalArgentina + data.digitalExtranjero;
        }
    } else {
        // Lógica para todos los meses
        if (format === 'fisico') {
            if (pais === 'argentina') total = data.fisicoArgentina;
            else if (pais === 'extranjero') total = data.fisicoExtranjero;
            else total = data.fisicoArgentina + data.fisicoExtranjero;
        } else if (format === 'digital') {
            if (pais === 'argentina') total = data.digitalArgentina;
            else if (pais === 'extranjero') total = data.digitalExtranjero;
            else total = data.digitalArgentina + data.digitalExtranjero;
        } else {
            if (pais === 'argentina') total = data.fisicoArgentina + data.digitalArgentina;
            else if (pais === 'extranjero') total = data.fisicoExtranjero + data.digitalExtranjero;
            else total = data.fisicoArgentina + data.fisicoExtranjero + data.digitalArgentina + data.digitalExtranjero;
        }
    }
    return total;
}

function obtenerEncabezado(format, pais) {
    if (format === 'fisico') {
        return pais === 'argentina' ? 'Ventas Físicas Argentinas' : pais === 'extranjero' ? 'Ventas Físicas Extranjeras' : 'Ventas Físicas';
    } else if (format === 'digital') {
        return pais === 'argentina' ? 'Ventas Digitales Argentinas' : pais === 'extranjero' ? 'Ventas Digitales Extranjeras' : 'Ventas Digitales';
    } else {
        return pais === 'argentina' ? 'Ventas Totales Argentinas' : pais === 'extranjero' ? 'Ventas Totales Extranjeras' : 'Ventas Totales';
    }
}

function checkEnter(event) {
    if (event.key === 'Enter') fetchData();
}

document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.btn-buscar').addEventListener('click', fetchData);
    document.getElementById('mesInicio').addEventListener('change', fetchData);
    document.getElementById('mesFin').addEventListener('change', fetchData);
    document.getElementById('format').addEventListener('change', fetchData);
    document.getElementById('pais').addEventListener('change', fetchData);
});
