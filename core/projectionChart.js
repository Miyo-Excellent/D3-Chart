function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Asegúrate de que el mes tenga dos dígitos
    return `${year}-${month}`;
}

function formatValue(value) {
    if (value >= 1000) {
        return (value / 1000).toFixed(0) + 'K'; // Redondea sin decimales y añade 'K'
    }
    return value.toFixed(0); // Redondea sin decimales
}


function openProjectionWindow(xRange, yRange) {
    const formattedXRange = xRange.map(date => formatDate(date));
    const formattedYRange = yRange.map(value => formatValue(value) + ' BTC');

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
        '<div>' + formattedYRange[0] + ' - ' + formattedYRange[1] + '</div>' +
        '</div>' +
        '<div class="w-50">' +
        '<div>TIME RANGE</div>' +
        '<div>' + formattedXRange[0] + ' - ' + formattedXRange[1] + '</div>' +
        '</div>' +
        '</div>' +
        '</div>';
    document.getElementById('projectionWindow').style.display = 'block'; // Cambiado a 'block' para mostrar el modal
}

// Cerrar el modal cuando se hace clic en cualquier lugar fuera del contenido del modal
document.getElementById('projectionWindow').addEventListener('click', function (event) {
    if (!event.target.closest('#projectionDetails')) {
        document.getElementById('projectionWindow').style.display = 'none';
    }
});


document.getElementById('projectionDetails').addEventListener('click', function (event) {
    event.stopPropagation();
});

window.closeModal = function () {
    document.getElementById('projectionWindow').style.display = 'none';
}

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
        },
        yaxis: {
            // title: 'Valores',
            side: 'right',
            range: [0, highestPrice],
            tickmode: 'linear',
            tick0: 0,
            dtick: highestPrice / 10,
            tickformat: '$,.0f'
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
