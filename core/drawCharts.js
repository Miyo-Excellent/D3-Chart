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

    let highestMarketPrice = 0;
    let highestOutlookPrice = 0;
    let todayPrice = 0;
    let limitPrice = 0;

    let projections = [];
    let plotData = [];

    switch (contextIndex) {
        case 0:
            console.log('Initializing Market Chart...');
            showOnlyMarketChart();
            // Market
            marketData = await getMarketData(timeDays);
            todayPrice = marketData.prices[marketData.prices.length - 1];
            highestMarketPrice = Math.max(...marketData.prices);

            // Limit
            limitPrice = highestMarketPrice > todayPrice * 3 ? todayPrice * 3 : highestMarketPrice * 1.3;

            console.log('highestMarketPrice: ', highestMarketPrice);
            console.log('todayPrice: ', todayPrice);
            console.log('limitPrice: ', limitPrice);
            
            // Draw
            drawMarketChart(marketData.dates, marketData.prices, limitPrice);
            break;
        case 1:
            console.log('Initializing Hybrid Chart...');
            showBothCharts();
            // Hybrid

            // Market
            marketData = await getMarketData(timeDays);
            highestMarketPrice = Math.max(...marketData.prices) ;
            todayPrice = marketData.prices[marketData.prices.length - 1];

            console.log('highestMarketPrice: ', highestMarketPrice);
            console.log('todayPrice: ', todayPrice);
            
            // Outlooks
            projections = generateProjections(); // dummy change to real data integration
            highestOutlookPrice = Math.max(...projections.map(projection => projection.maxPrice));

            console.log('highestOutlookPrice: ', highestOutlookPrice);
            
            // Limit
            limitPrice = Math.max(highestMarketPrice, highestOutlookPrice) > todayPrice * 3  ? todayPrice * 3 : Math.max(highestMarketPrice, highestOutlookPrice) * 1.3;

            console.log('limitPrice: ', limitPrice);

            // Draw
            drawMarketChart(marketData.dates, marketData.prices, limitPrice);
            plotData = generatePlotData(projections, todayPrice); // dummy change to real data integration
            drawPlot(plotData, limitPrice, todayPrice);
            break;
        case 2:
            console.log('Initializing Outlooks Chart...');

            // Market
            marketData = await getMarketData(timeDays);
            todayPrice = marketData.prices[marketData.prices.length - 1];

            showOnlyProjectionChart();
            // Outlooks
            projections = generateProjections();
            highestOutlookPrice = Math.max(...projections.map(projection => projection.maxPrice));

            console.log('todayPrice: ', todayPrice);
            console.log('highestOutlookPrice: ', highestOutlookPrice);


            limitPrice = highestOutlookPrice > todayPrice * 3 ? todayPrice * 3 : highestOutlookPrice * 1.3;

            console.log('limitPrice: ', limitPrice);

            console.log('highestOutlookPrice: ', highestOutlookPrice);

            plotData = generatePlotData(projections, todayPrice); // dummy change to real data integration
            drawPlot(plotData, limitPrice, todayPrice);
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



