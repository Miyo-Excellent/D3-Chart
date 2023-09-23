import { setContextFilter, setTimeFilter } from './core/filters.js';
import { drawManager } from './core/drawCharts.js';

// Valores iniciales
let currentContext = 1;
let currentTime = 3650;
const initialCurrency = 'AAPL';

// Dibujo inicial
drawManager(currentContext, currentTime, initialCurrency);

// Escuchadores de eventos para los filtros
document.getElementById('contextFilters').addEventListener('click', (event) => {
    currentContext = parseInt(event.target.dataset.value);
    setContextFilter(currentContext);  // Llama a la función desde core/filters.js
    drawManager(currentContext, currentTime, initialCurrency);
});

document.getElementById('timeFilters').addEventListener('click', (event) => {
    currentTime = event.target.dataset.value;
    setTimeFilter(currentTime);  // Llama a la función desde core/filters.js
    drawManager(currentContext, currentTime, initialCurrency);
});


// outlooksFilterModal

// document.getElementById('openOutlooksFilter').addEventListener('click', function () {
//     document.getElementById('outlooksFilterModal').style.display = 'block';
// });

// document.getElementById('applyFilters').addEventListener('click', function () {
//     document.getElementById('outlooksFilterModal').style.display = 'none';
// });

// Cerrar el modal de filtros cuando se presiona la tecla "ESC"
// document.addEventListener('keydown', function (event) {
//     if (event.key === 'Escape') {
//         document.getElementById('outlooksFilterModal').style.display = 'none';
//     }
// });
