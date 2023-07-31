import { getLastPrice } from './apis/coinGecko/index.js';
import { generateProjections } from './helpers/dummyData.js';
import { generatePlotData } from './helpers/plotData.js';

// Fetch data from the CoinGecko API
var lastPrice = await getLastPrice();

// Generamos las proyecciones
var projections = generateProjections();

// Generamos la data para el gráfico
var plotData = generatePlotData(projections, lastPrice);


async function drawPlot() {


    var layout = {
        title: 'Proyecciones',
        xaxis: {
            title: 'Tiempo',
            type: 'date',
            range: ['2023-07-23', '2023-12-31']
        },
        yaxis: {
            title: 'Valores',
            side: 'right',
            range: [0, 100000]
        },
        dragmode: 'lasso',
        shapes: [
            // Línea horizontal
            {
                type: 'line',
                xref: 'paper',
                x0: 0,
                y0: lastPrice,
                x1: 1,
                y1: lastPrice,
                line: {
                    color: 'HotPink',
                    width: 1
                }
            }
        ],
        showlegend: false
    };

    Plotly.newPlot('myDiv2', plotData, layout); // Aquí también se cambia 'data' por 'plotData'

    var myPlot = document.getElementById('myDiv2');

    myPlot.on('plotly_selected', function (eventData) {
        if (eventData) {
            var xRange = eventData.range.x;
            var yRange = eventData.range.y;

            // Aquí puedes utilizar xRange y yRange para crear tu proyección.
            // xRange[0] y xRange[1] son el inicio y el fin del rango de selección en el eje x,
            // yRange[0] y yRange[1] son el inicio y el fin del rango de selección en el eje y.

            console.log(xRange, yRange);
        }
    });
}

drawPlot();
