import { fetchMarketData } from './apis/TwelveData/index.js';
import { addButtonListeners } from './core/buttonUtils.js';
import { buildChart, updateChart } from './core/chartUtils.js';

// Global states for the chart
let chartState = {
  timeframe: 3650, // 3650
  context: 0
};


/**
 * Initializes the app.
 * @returns {void}
 * @example
 * initApp();
 */
const initApp = async () => {
  const width = window.innerWidth - 20; // Modificado aquí
  const height = 540;
  const margin = { top: 20, right: 70, bottom: 50, left: 70 };
  const data = await fetchMarketData(chartState.timeframe);

  buildChart('#chart-container', width, height, margin, chartState.context, data, chartState.timeframe);

  addButtonListeners('.left-group .btn', timeframe => {
    chartState.timeframe = parseInt(timeframe, 10);
    updateChartBasedOnState();
  });

  addButtonListeners('.center-group .btn', contextIndex => {
    chartState.context = parseInt(contextIndex, 10);
    updateChartBasedOnState();
  });

  const updateChartBasedOnState = async () => {
    const data = await fetchMarketData(chartState.timeframe);
    await updateChart('#chart-container', width, height, margin, chartState.context, data, chartState.timeframe);
  };
};

initApp();