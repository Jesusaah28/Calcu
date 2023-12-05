function calcular() {
    const num1 = parseFloat(document.getElementById('num1').value);
    const num2 = parseFloat(document.getElementById('num2').value);
    const operacion = document.getElementById('operacion').value;

    fetch('/calcular', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ num1, num2, operacion }),
    })
        .then(response => response.text())
        .then(data => {
            // Parsear la respuesta XML
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data, 'application/xml');

            // Obtener el valor del resultado del XML
            const resultado = xmlDoc.querySelector('valor').textContent;

            // Mostrar solo el valor en el HTML
            const resultadoElement = document.getElementById('resultado');
            resultadoElement.innerHTML = `Resultado: ${resultado}`;
        })
        .catch(error => console.error('Error:', error));
}
