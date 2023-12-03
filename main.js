import { getMarketData } from './apis/coinGekko/index.js';
import { buildHistoricalChart } from './historical.js';

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

  switch (context) {
    case 0:
      buildHistoricalChart(svg, historicalGroupSvg, width, height, margin);
      break;
    case 1:
      // createRect(historicalGroupSvg, margin.left, margin.top, halfWidth - margin.left, height - margin.top - margin.bottom, '#293C4B');
      // createRect(projectionGroupSvg, halfWidth, margin.top, halfWidth - margin.right, height - margin.top - margin.bottom, 'white');
      break;
    case 2:
      // createRect(projectionGroupSvg, margin.left, margin.top, width - margin.left - margin.right, height - margin.top - margin.bottom, 'white');
      break;
  }
};

const width = 2540;
const height = 540;
const margin = { top: 20, right: 70, bottom: 50, left: 70 };

buildChart('#chart-container', width, height, margin, 0);