import { drawMarketChart } from './marketChart.js';
import { drawPlot } from './projectionChart.js';

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
