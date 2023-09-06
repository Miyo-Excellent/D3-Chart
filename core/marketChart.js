
export async function drawMarketChart(dates, prices, highestPrice) {
    var trace1 = {
        x: dates,
        y: prices,
        mode: 'lines',
        name: 'BTC',
        line: {
            color: '#17A2B8',  // Puedes elegir el color que prefieras
            width: 2           // Elige el ancho de la línea que prefieras
        },
        fill: 'tozeroy',     // Llena el área hasta el eje Y=0
        fillcolor: '#1F2D37' // Color del llenado, aquí utilizo un color más claro
    };

    var layout = {
        paper_bgcolor: '#293C4B',
        plot_bgcolor: '#293C4B',
        xaxis: {
            type: 'date',
            tickfont: {
                family: 'Montserrat, sans-serif',
                size: 12,
                color: '#FFFFFF'
            },
            linecolor: '#FFFFFF',  // Color de la línea del eje Y
            linewidth: -1,
            // gridcolor: '#FFFFFF',  // Color de las líneas de la cuadrícula
        },
        font: {
            family: 'Montserrat, sans-serif', // Fuente general
            size: 12,                      // Tamaño de fuente general
            color: '#FFFFFF'               // Color de la fuente
        },
        yaxis: {
            range: [0, highestPrice],
            tickmode: 'linear',
            tick0: 0,
            dtick: highestPrice / 10,
            tickformat: '$,.0f',
            tickfont: {
                family: 'Montserrat, sans-serif',
                size: 12,
                color: '#FFFFFF'
            },
            linecolor: '#FFFFFF',  // Color de la línea del eje Y
            linewidth: -1,
            gridcolor: '#FFFFFF',  // Color de las líneas de la cuadrícula
        },
        margin: { l: 50, r: 0, t: 20, b: 40,  },
    };

    var plotData = [trace1];

    Plotly.newPlot('marketChart', plotData, layout);
}

// window.drawMarketChart = drawMarketChart;
