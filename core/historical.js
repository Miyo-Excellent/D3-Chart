import { createRect, valueInThousands, tickValues, buildCircle } from '../helpers/helper.js';

/**
 * Se encarga de construir el gráfico de histórico.
 * @param {Object} group: Grupo donde se dibujará el gráfico.
 * @param {number} width: Ancho del gráfico.
 * @param {height} height: Alto del gráfico.
 * @param {number} xPosition: Posición en X del gráfico.
 * @param {number} yPosition: Posición en Y del gráfico.
 * @param {boolean} only: Indica si el gráfico es el único en el contenedor.
 * @param {Object[]} data: Datos del gráfico.
 * @param {Object[]} lastData: Datos del último día.
 * @param {number} highestValue: Valor más alto del gráfico.
 * @returns {Promise<void>}
 */

export const buildHistoricalChart = (group, width, height, xPosition, yPosition, only, data, lastData, highestValue) => {
    createRect(group, xPosition, yPosition, width, height, '#293C4B');

    const xDomain = d3.extent(data, d => d.date);
    const yDomain = [0, highestValue];

    const xScale = d3.scaleUtc().domain(xDomain).range([0, width]);
    const yScale = d3.scaleLinear().domain(yDomain).range([height, 0]);

    const ticks = tickValues(highestValue, 9, 10);

    // x axis
    group.append('g')
        .attr('transform', `translate(${xPosition},${yPosition + height})`)
        .call(d3.axisBottom(xScale).tickSize(0))
        .call(g => g.select('.domain').remove())
        .call(g => g.selectAll('.tick text')
            .attr('dy', '2.2em')
            .style('font-family', 'Montserrat')
            .style('font-size', '12px')
            .style('font-weight', '500')
            .style('line-height', '15px')
            .style('letter-spacing', '0.4285714030265808px')
            .style('fill', '#D6D9DC'));

    // y axis left
    group.append('g')
        .attr('transform', `translate(${xPosition},${yPosition})`)
        .call(d3.axisLeft(yScale).tickSize(0).tickFormat(valueInThousands).tickValues(ticks))
        .call(g => g.select('.domain').remove())
        .call(g => g.selectAll('.tick text')
            .attr('dx', '-1.5em')
            .style('font-family', 'Montserrat')
            .style('font-size', '12px')
            .style('font-weight', '500')
            .style('line-height', '15px')
            .style('letter-spacing', '0.4285714030265808px')
            .style('text-align', 'left')
            .style('fill', '#D6D9DC'))
        .call(g => g.selectAll('.tick line')
            .attr('stroke', '#3A4B59')
            .attr('x2', width));

    if (only === true) {
        // y axis right
        group.append('g')
            .attr('transform', `translate(${xPosition + width},${yPosition})`)
            .call(d3.axisRight(yScale).tickSize(0).tickFormat(valueInThousands).tickValues(ticks))
            .call(g => g.select('.domain').remove())
            .call(g => g.selectAll('.tick text')
                .attr('dx', '1.5em')
                .style('font-family', 'Montserrat')
                .style('font-size', '12px')
                .style('font-weight', '500')
                .style('line-height', '15px')
                .style('letter-spacing', '0.4285714030265808px')
                .style('text-align', 'left')
                .style('fill', '#D6D9DC'))
            .call(g => g.selectAll('.tick line')
                .attr('stroke', '#3A4B59')
                .attr('x2', -width));
    }


    // line
    const groupLine = d3.line()
        .x(d => xScale(d.date) + xPosition)
        .y(d => yScale(d.close) + yPosition);

    const path = group.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', '#17A2B8')
        .attr('stroke-width', 1.5)
        .attr('d', groupLine);

    const totalLength = path.node().getTotalLength();

    // Line animation
    path.attr('stroke-dasharray', totalLength + " " + totalLength)
        .attr('stroke-dashoffset', totalLength)
        .transition()
        .duration(2000)
        .attr('stroke-dashoffset', 0);

    buildCircle(group, xPosition, yPosition, xScale, yScale, lastData);

    return;
};
