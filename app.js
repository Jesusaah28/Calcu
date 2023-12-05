const express = require('express');
const bodyParser = require('body-parser');
const bodyParserXML = require('body-parser-xml');
const fs = require('fs');
const app = express();
const port = 8080;

// Middleware para procesar datos en formato JSON y XML
app.use(bodyParser.json());
bodyParserXML(bodyParser);

// Ruta para realizar cálculos
app.post('/calcular', (req, res) => {
    const { num1, num2, operacion } = req.body;

    if (isNaN(num1) || isNaN(num2)) {
        return res.status(400).send('Los números proporcionados no son válidos.');
    }

    let resultado;
    switch (operacion) {
        case 'sumar':
            resultado = num1 + num2;
            break;
        case 'restar':
            resultado = num1 - num2;
            break;
        case 'multiplicar':
            resultado = num1 * num2;
            break;
        case 'dividir':
            resultado = num1 / num2;
            break;
        default:
            return res.status(400).send('La operación proporcionada no es válida.');
    }

    // Crea un objeto XML con el resultado y los números proporcionados
    const responseXML = `<resultado>
                        <valor>${resultado}</valor>
                        <num1>${num1}</num1>
                        <num2>${num2}</num2>
                        <operacion>${operacion}</operacion>
                        </resultado>`;

    // Configurar la respuesta con el tipo de contenido XML
    res.set('Content-Type', 'application/xml');
    res.status(200).send(responseXML);

    // Guardar los resultados en un archivo XML
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const fileName = `resultado_${timestamp}.xml`;
    fs.writeFileSync(fileName, responseXML);
    console.log(`Resultado guardado en ${fileName}`);
});

// Ruta para manejar las solicitudes GET a /resultado.xml
app.get('/resultado.xml', (req, res) => {
    const { num1, num2, operacion } = req.query;

    // Crear un objeto XML con los parámetros de la solicitud
    const responseXML = `<resultado>
                        <num1>${num1}</num1>
                        <num2>${num2}</num2>
                        <operacion>${operacion}</operacion>
                        </resultado>`;

    // Configura la respuesta con el tipo de contenido XML
    res.set('Content-Type', 'application/xml');
    res.status(200).send(responseXML);
});

// Servidor estático Express para los archivos front-end
app.use(express.static(__dirname));

// Inicia el servidor
app.listen(port, () => {
    console.log(`Servidor web escuchando en http://localhost:${port}`);
});
