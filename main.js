import { getMarketData } from './apis/coinGekko/index.js';
import { buildHistoricalChart } from './historical.js';
import { buildProjectionChart } from './projection.js';

/**
 * Se encarga de construir el contenedor del gráfico.
 * @param containerSelector: Selector del contenedor donde se dibujará el gráfico.
 * @param width: Ancho del gráfico.
 * @param height: Alto del gráfico.
 * @param margin: Margen del gráfico.
 * @param context: Contexto en el que se dibujará el gráfico.
 */
const buildChart = async (container, width, height, margin, context, data) => {
  const svg = d3.select(container).append('svg')
    .attr('width', width)
    .attr('height', height);

  const halfWidth = width / 2;

  const projectionGroupSvg = svg.append('g');
  const historicalGroupSvg = svg.append('g');

  const lastData = data[data.length - 1];
  const highestValue = d3.max(data, d => d.close * 1.3)

  const grouphWidthAlone = width - margin.left - margin.right;
  const grouphHeightStandard = height - margin.top - margin.bottom;

  switch (context) {
    case 0:
      buildHistoricalChart(historicalGroupSvg, grouphWidthAlone, grouphHeightStandard, margin.left, margin.top, true, data, lastData, highestValue);
      break;
    case 1:
      buildProjectionChart(projectionGroupSvg, halfWidth - margin.right, grouphHeightStandard, halfWidth, margin.top, false, [], lastData, highestValue);
      buildHistoricalChart(historicalGroupSvg, halfWidth - margin.left, grouphHeightStandard, margin.left, margin.top, false, data, lastData, highestValue);
      break;
    case 2:
      buildProjectionChart(projectionGroupSvg, grouphWidthAlone, grouphHeightStandard, margin.left, margin.top, true, [], lastData, highestValue);
      break;
  }
};

const width = 2540;
const height = 540;
const margin = { top: 20, right: 70, bottom: 50, left: 70 };
const { dates, prices } = await getMarketData(365 * 10);
const data = dates.map((date, index) => ({
  date: new Date(date),
  close: prices[index]
}));

buildChart('#chart-container', width, height, margin, 1, data);