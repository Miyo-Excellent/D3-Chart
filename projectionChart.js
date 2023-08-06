import { getLastPrice } from './apis/coinGecko/index.js';
import { generateProjections } from './helpers/dummyData.js';
import { generatePlotData } from './helpers/plotData.js';

// Fetch data from the CoinGecko API
var lastPrice = await getLastPrice();

// Generamos las proyecciones
var projections = generateProjections();

// Generamos la data para el gráfico
var plotData = generatePlotData(projections, lastPrice);

function openProjectionWindow(xRange, yRange) {
    document.getElementById('projectionDetails').innerHTML =
        '<div class="container">' +
            '<div class="first-child">' +
                '<div>' +
                    '<img src="https://via.placeholder.com/32" alt="Avatar" class="avatar">' +
                '</div>' +
                '<div>' +
                    '<div class="d-block ml-5">Monica Smith</div>' +
                    '<div class="d-block ml-5">Asesora de marketing digital</div>' +
                '</div>' +
            '<div>' +
        '</div>' +
        '</div>' +
            '<div class="second-child">' +
                '<div class="w-50">' +
                    '<div>PRICE RANGE</div>' +
                    '<div>' + yRange[0] + ' - ' + yRange[1] + '</div>' +
                '</div>' +
                '<div class="w-50">' +
                    '<div>TIME RANGE</div>' +
                    '<div>' + xRange[0] + ' - ' + xRange[1] + '</div>' +
                '</div>' +
            '</div>' +
        '</div>';
    document.getElementById('projectionWindow').style.display = "block";
}



window.closeModal = function () {
    document.getElementById('projectionWindow').style.display = "none";
}


async function drawPlot() {
    var currentYear = new Date().getFullYear(); // Obtiene el año actual
    var endYear = currentYear + 10; // Añade 10 años al año actual

    var layout = {
        title: 'Proyecciones',
        xaxis: {
            title: 'Tiempo',
            tickmode: 'linear',
            tick0: currentYear,
            dtick: 1,
            range: [currentYear, endYear],
            type: 'linear',
        },
        yaxis: {
            title: 'Valores',
            side: 'right',
            range: [0, 100000]
        },
        dragmode: 'select',
        shapes: [
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

    Plotly.newPlot('projectionChart', plotData, layout);

    var myPlot = document.getElementById('projectionChart');

    myPlot.on('plotly_selected', function (eventData) {
        if (eventData) {
            var xRange = eventData.range.x;
            var yRange = eventData.range.y;

            openProjectionWindow(xRange, yRange); // Llama a la función para abrir la ventana
        }
    });
}

drawPlot();
