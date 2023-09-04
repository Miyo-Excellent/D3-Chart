import { setContextFilter, setTimeFilter } from './core/filters.js';
import { drawManager } from './core/drawCharts.js';

// Valores iniciales
const initialContext = 0;
const initialTime = 7;
const initialCurrency = 'AAPL';

// Dibujo inicial
drawManager(initialContext, initialTime, initialCurrency);

// Escuchadores de eventos para los filtros
document.getElementById('contextFilters').addEventListener('click', (event) => {
    const newContext = event.target.dataset.value;
    setContextFilter(newContext);  // Llama a la función desde core/filters.js
    drawManager(newContext, initialTime);
});

document.getElementById('timeFilters').addEventListener('click', (event) => {
    const newTime = event.target.dataset.value;
    setTimeFilter(newTime);  // Llama a la función desde core/filters.js
    drawManager(initialContext, newTime);
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
