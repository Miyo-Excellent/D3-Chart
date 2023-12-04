import { createRect } from './helper.js';

/**
 * Se encarga de construir el gráfico de histórico.
 * @param {Object} group: Grupo donde se dibujará el gráfico.
 * @param {number} width: Ancho del gráfico.
 * @param {height} height: Alto del gráfico.
 * @param {number} xPosition: Posición en X del gráfico.
 * @param {number} yPosition: Posición en Y del gráfico.
 * @param {boolean} only: Indica si el gráfico es el único en el contenedor.
 * @returns {Promise<void>}
 */

export const buildHistoricalChart = (group, width, height, xPosition, yPosition, only, data, lastData, highestValue) => {
    createRect(group, xPosition, yPosition, width, height, '#293C4B');

    const xDomain = d3.extent(data, d => d.date);
    const yDomain = [0, highestValue];

    const xScale = d3.scaleUtc().domain(xDomain).range([0, width]);
    const yScale = d3.scaleLinear().domain(yDomain).range([height, 0]);

    const tickInterval = highestValue / 9;
    const tickValues = Array.from({ length: 10 }, (_, i) => i * tickInterval);

    const formatYAxis = d => {
        if (d === 0) {
            return "$0K";
        }
        const valueInThousands = d / 1000;
        return `$${valueInThousands.toFixed(1)}K`;
    };

    group.append('g')
        .attr('transform', `translate(${xPosition},${yPosition + height})`)
        .call(d3.axisBottom(xScale).ticks(10));

    group.append('g')
        .attr('transform', `translate(${xPosition},${yPosition})`)
        .call(d3.axisLeft(yScale).tickSize(0).tickFormat(formatYAxis).tickValues(tickValues))
        .call(g => g.select('.domain').remove())
        .call(g => g.selectAll('.tick line')
            .attr('stroke', '#3A4B59')
            .attr('x2', width));

    if (only === true) {
        group.append('g')
            .attr('transform', `translate(${xPosition + width},${yPosition})`)
            .call(d3.axisRight(yScale).tickSize(0).tickFormat(formatYAxis).tickValues(tickValues))
            .call(g => g.select('.domain').remove())
            .call(g => g.selectAll('.tick line')
                .attr('stroke', '#3A4B59')
                .attr('x2', -width));
    }

    return;
};

