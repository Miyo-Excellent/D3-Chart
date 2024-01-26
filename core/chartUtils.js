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
export const buildChart = async (container, width, height, margin, context, data, timeframe) => {
    const svg = d3.select(container).append('svg')
        .attr('width', width)
        .attr('height', height);

    const halfWidth = width / 2;

    const projectionGroupSvg = svg.append('g');
    const historicalGroupSvg = svg.append('g');

    const lastData = data[data.length - 1];

    let highestValue = d3.max(data, d => d.close * 1.3);
    highestValue = highestValue > lastData.close * 3 ? highestValue : lastData.close * 3;   

    const grouphWidthAlone = width - margin.left - margin.right;
    const grouphHeightStandard = height - margin.top - margin.bottom;

    buildButtons(grouphWidthAlone, margin.left, margin.right, context);

    const hasOverflow = (context === 1 || context === 2) && timeframe === 3650; 

    const years = timeframe / 365;

    switch (context) {
        case 0:
            buildHistoricalChart(historicalGroupSvg, grouphWidthAlone, grouphHeightStandard, margin.left, margin.top, true, data, lastData, highestValue, timeframe);
            break;
        case 1:
            buildProjectionChart(projectionGroupSvg, halfWidth - margin.right, grouphHeightStandard, halfWidth, margin.top, false, [], lastData, highestValue, hasOverflow, years, timeframe);
            buildHistoricalChart(historicalGroupSvg, halfWidth - margin.left, grouphHeightStandard, margin.left, margin.top, false, data, lastData, highestValue, hasOverflow, timeframe);
            break;
        case 2:
            buildProjectionChart(projectionGroupSvg, grouphWidthAlone, grouphHeightStandard, margin.left, margin.top, true, [], lastData, highestValue, hasOverflow, years, timeframe);
            break;
    }
};

/**
 * Se encarga de construir el contenedor de los botones.
 * @param width: Ancho de los botones.
 * @param marginLeft: Margen izquierdo de los botones.
 * @param marginRight: Margen derecho de los botones.
 */

export const buildButtons = (width, marginLeft, marginRight, context) => {
    d3.select('.button-bar')
        .style('width', `${width}px`)
        .style('margin-left', `${marginLeft}px`)
        .style('margin-right', `${marginRight}px`)
        .style('display', 'flex');

    if (context === 0) {
        d3.select('.right-group').style('display', 'none');
    }else{
        d3.select('.right-group').style('display', 'flex');
    }
};

/**
 * Se encarga de actualizar el gráfico.
 * @param containerSelector: Selector del contenedor donde se dibujará el gráfico.
 * @param width: Ancho del gráfico.
 * @param height: Alto del gráfico.
 * @param margin: Margen del gráfico.
 * @param context: Contexto en el que se dibujará el gráfico.
 */

export async function updateChart(container, width, height, margin, context, data, timeframe) {
    d3.select(container).selectAll('svg').remove();
    await buildChart(container, width, height, margin, context, data, timeframe);
}