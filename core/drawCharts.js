import { getMarketData } from '../apis/alphaVantage/index.js';
import { drawMarketChart } from './marketChart.js';
import { drawPlot } from './projectionChart.js';
import { generateProjections } from '../helpers/dummyData.js';
import { generatePlotData } from '../helpers/plotData.js';

/**
 * @function drawManager
 * @description Gestiona el dibujo de los gráficos en función de los filtros de contexto y tiempo seleccionados.
 * @param {number} contextIndex - El índice del filtro de contexto seleccionado.
 * @param {number} timeDays - El número de días seleccionado en el filtro de tiempo.
 * @param {string} currency - La moneda seleccionada en el filtro de moneda.
 * @returns {void}
 * @example
 * drawManager(1, 7);
 * // Dibuja los gráficos con el filtro de contexto "1" = "Hibrid" y el filtro de tiempo "7" = "1 week".
 * @example
 * drawManager(0, 30);
 * // Dibuja los gráficos con el filtro de contexto "0" = "Market" y el filtro de tiempo "30" = "1 month".
 */

export const drawManager = async (contextIndex, timeDays, currency) => {
    console.log('drawManager charts with context:',
    {
        contextIndex: contextIndex,
        timeDays: timeDays,
        currency: currency
    });

    let marketData = {
        dates: [],
        prices: []
    }

    let highestPrice = 0;

    let projections = [];
    let plotData = [];

    switch (contextIndex) {
        case 0:
            console.log('Initializing Market Chart...');
            showOnlyMarketChart();
            // Market
            marketData = await getMarketData(timeDays);
            highestPrice = Math.max(...marketData.prices) * 1.3;
            drawMarketChart(marketData.dates, marketData.prices, highestPrice);
            break;
        case 1:
            console.log('Initializing Hybrid Chart...');
            showBothCharts();
            // Hybrid
            marketData = await getMarketData(timeDays);
            highestPrice = Math.max(...marketData.prices) * 1.3;
            drawMarketChart(marketData.dates, marketData.prices, highestPrice);

            let todayPrice = marketData.prices[marketData.prices.length - 1];

            projections = generateProjections();
            plotData = generatePlotData(projections, todayPrice);
            
            drawPlot(plotData, highestPrice, todayPrice);
            break;
        case 2:
            console.log('Initializing Outlooks Chart...');
            showOnlyProjectionChart();
            // Outlooks
            projections = generateProjections();

            highestPrice = Math.max(...projections.map(projection => projection.price)) * 1.3;

            plotData = generatePlotData(projections, 0);
            drawPlot(plotData, highestPrice, 0);
            break;
        default:
            console.log('Error: contextIndex out of range: ' + contextIndex);
    }
};


const showOnlyMarketChart = () => {
    document.getElementById('marketChart').style.display = 'block';
    document.getElementById('marketChart').style.width = '100%';
    document.getElementById('projectionChart').style.display = 'none';
};

const showBothCharts = () => {
    document.getElementById('marketChart').style.display = 'block';
    document.getElementById('marketChart').style.width = '50%';
    document.getElementById('projectionChart').style.display = 'block';
    document.getElementById('projectionChart').style.left = '50%';
    document.getElementById('projectionChart').style.width = '50%';
};

const showOnlyProjectionChart = () => {
    document.getElementById('marketChart').style.display = 'none';
    document.getElementById('projectionChart').style.display = 'block';
    document.getElementById('projectionChart').style.left = '0';
    document.getElementById('projectionChart').style.width = '100%';
};



