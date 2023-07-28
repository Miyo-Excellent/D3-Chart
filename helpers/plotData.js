
export function generatePlotData(projections, lastPrice) { // Agregar argumento lastPrice
    var plotData = [];

    // Para cada proyección, creamos una traza que dibuja un polígono alrededor del área de la proyección
    projections.forEach((projection, i) => {
        var trace1 = {
            x: [projection.startTime, projection.endTime, projection.endTime, projection.startTime],
            y: [projection.minPrice, projection.minPrice, projection.maxPrice, projection.maxPrice],
            fill: 'toself',
            mode: 'lines',
            name: projection.userName,
            // Coloreado condicional
            fillcolor: projection.maxPrice < lastPrice ? 'red' : 
                        (projection.minPrice > lastPrice ? 'green' : 'grey'),
            line: {
                color: projection.maxPrice < lastPrice ? 'darkred' : 
                        (projection.minPrice > lastPrice ? 'darkgreen' : 'grey'),
            }
        };

        // Añadimos las trazas a la data del gráfico
        plotData.push(trace1);
    });

    return plotData;
}