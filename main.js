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
const buildChart = async (container, width, height, margin, context) => {
  const svg = d3.select(container).append('svg')
    .attr('width', width)
    .attr('height', height);

  const halfWidth = width / 2;

  let historicalGroupSvg = svg.append('g');
  let projectionGroupSvg = svg.append('g');

  // const { dates, prices } = await getMarketData(365 * 10);

  // const data = dates.map((date, index) => ({
  //   date: new Date(date),
  //   close: prices[index]
  // }));

  // const lastDatum = data[data.length - 1];

  switch (context) {
    case 0:
      buildHistoricalChart(historicalGroupSvg, width - margin.left - margin.right, height - margin.top - margin.bottom, margin.left, margin.top, true);
      break;
    case 1:
      buildHistoricalChart(historicalGroupSvg, halfWidth - margin.left, height - margin.top - margin.bottom, margin.left, margin.top, false);
      buildProjectionChart(projectionGroupSvg, halfWidth - margin.right, height - margin.top - margin.bottom, halfWidth, margin.top, false);
      break;
    case 2:
      buildProjectionChart(projectionGroupSvg, width - margin.left - margin.right, height - margin.top - margin.bottom, margin.left, margin.top, true);
      break;
  }
};

const width = 2540;
const height = 540;
const margin = { top: 20, right: 70, bottom: 50, left: 70 };

buildChart('#chart-container', width, height, margin, 1);