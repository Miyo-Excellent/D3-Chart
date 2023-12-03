import { createRect } from './helper.js';

/**
 * Se encarga de construir el gráfico histórico.
 * @param {Object} svg: Objeto svg.
 * @param {Object} group: Objeto grupo svg.
 * @param {number} width: Ancho del gráfico.
 * @param {number} height: Alto del gráfico.
 * @param {Object} margin: Margen del gráfico.
 * @param {boolean} extended: Indica si se debe extender el gráfico.
 */
export const buildHistoricalChart = (svg, group, width, height, margin, extended) => {

    let rectWidth = width - margin.left - margin.right;
    let rectHeight = height - margin.top - margin.bottom;

    createRect(group, margin.left, margin.top, rectWidth, rectHeight, '#293C4B');

    console.log('Executing buildHistoricChart', {
        'rectWidth': rectWidth,
        'rectHeight': rectHeight,
        'width': width,
        'start-left': margin.left,
        'start-top': margin.top,
    });
}