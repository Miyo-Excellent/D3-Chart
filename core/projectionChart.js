

// Función que dibuja el gráfico de proyecciones

export async function drawPlot(plotData, highestPrice, todayPrice) {
    var currentDate = new Date(); // Obtiene la fecha actual
    var endYear = new Date(currentDate.getFullYear() + 10, currentDate.getMonth(), currentDate.getDate()); // Añade 10 años a la fecha actual

    var layout = {
        // title: 'Proyecciones',
        margin: { l: 0, r: 50, t: 20, b: 40 },
        xaxis: {
            type: 'date',
            tickmode: 'linear', // Establece el modo de tick en 'linear'
            tick0: currentDate.toISOString(), // Comienza desde la fecha actual
            // deben haber 10 ticks
            dtick: 31536000000, // Intervalo de 1 año en milisegundos
            range: [currentDate.toISOString(), endYear.toISOString()], // Rango desde la fecha actual hasta 10 años después
            tickformat: "%Y", // Muestra solamente el año en el eje X
            linecolor: '#FFFFFF',  // Color de la línea del eje Y
            linewidth: 1,
            gridcolor: '#FFFFFF',  // Color de las líneas de la cuadrícula
        },
        yaxis: {
            // title: 'Valores',
            side: 'right',
            range: [0, highestPrice],
            tickmode: 'linear',
            tick0: 0,
            dtick: highestPrice / 10,
            tickformat: '$,.0f',
            linecolor: '#FFFFFF',  // Color de la línea del eje Y
            linewidth: 1,
            gridcolor: 'gray',  // Color de las líneas de la cuadrícula
        },
        dragmode: 'select',
        shapes: [
            {
                type: 'line',
                xref: 'paper',
                x0: 0,
                y0: todayPrice,
                x1: 1,
                y1: todayPrice,
                line: {
                    color: 'HotPink',
                    width: 1
                }
            }
        ],
        showlegend: false,
        font: {
            family: 'Montserrat, sans-serif', // Fuente general
            size: 12,                      // Tamaño de fuente general
        },
    };

    Plotly.newPlot('projectionChart', plotData, layout);
}