import { drawMarketChart } from './core/marketChart.js';
import { drawPlot } from './core/projectionChart.js';

// the draw are created in base of the filters and context,
// context are a new filters that are selected between three options: hybrid, market and projection
// for the default the context are hybrid and we need to create the draw for this context
// if the user click in the market or projection button we need to change the context and create the draw for this context, hidden the other draw and not drawing the other draw for reduce the cost of the page
// so if we want to draw the marketChart and ProjectionChart we first need to get the context and with the default filter selected that is MAX: that is 10 years we need to create the draw for this context and filter
// so always in the first load we are going to draw the marketChart and ProjectionChart with the default filter and context
// getting the data we also can pass data to the draws for making the Y axis equal in both draws
// so we need to create a function that get the data for the draw and pass the data to the draw
// the draw function will do that only draw the chart


drawMarketChart();
drawPlot();

document.getElementById('openOutlooksFilter').addEventListener('click', function () {
    document.getElementById('outlooksFilterModal').style.display = 'block';
});

// Eliminamos este bloque ya que no queremos cerrar el modal con un clic fuera del contenido
// document.getElementById('outlooksFilterModal').addEventListener('click', function () {
//     document.getElementById('outlooksFilterModal').style.display = 'none';
// });

document.getElementById('applyFilters').addEventListener('click', function () {
    document.getElementById('outlooksFilterModal').style.display = 'none';
});

// Cerrar el modal de filtros cuando se presiona la tecla "ESC"
document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        document.getElementById('outlooksFilterModal').style.display = 'none';
    }
});
