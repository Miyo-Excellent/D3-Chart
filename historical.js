import { createRect, valueInThousands, tickValues } from './helper.js';

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
            .attr('dx', '-0.8em')
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
                .attr('dx', '0.8em')
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

    group.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', '#17A2B8')
        .attr('stroke-width', 1.5)
        .attr('d', groupLine);

    // circle
    const outerRingRadius = 9;
    const innerCircleRadius = 4.5;
    const circleX = xScale(lastData.date) + xPosition;
    const circleY = yScale(lastData.close) + yPosition;
    group.append('circle')
        .attr('cx', circleX)
        .attr('cy', circleY)
        .attr('r', outerRingRadius)
        .attr('fill', '#fff')
        .attr('stroke', '#17A2B8')
        .attr('stroke-width', 1.5)
        .attr('fill-opacity', 0.8);
    group.append('circle')
        .attr('cx', circleX)
        .attr('cy', circleY)
        .attr('r', innerCircleRadius)
        .attr('fill', '#17A2B8');

    return;
};

