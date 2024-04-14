import { createRect, valueInThousands, tickValues, buildCircle, calculateXTicks, getTickFormat, buildTooltip } from '../helpers/helper.js';

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


export const buildHistoricalChart = (group, width, height, xPosition, yPosition, only, data, lastData, highestValue, timeframe) => {
    const overflowHeight = 22;
    const adjustedHeight = height - overflowHeight;

    group.append('rect')
        .attr('x', xPosition)
        .attr('y', yPosition)
        .attr('width', width)
        .attr('height', overflowHeight)
        .attr('fill', "#FFFFFF");

    yPosition += overflowHeight;

    createRect(group, xPosition, yPosition, width, adjustedHeight, '#FFFFFF');


    let xDomain;
    if (timeframe === 2) {
        const currentTime = new Date();
        const oneDayAgo = new Date(currentTime.getTime() - 24 * 60 * 60 * 1000);
        xDomain = [oneDayAgo, currentTime];

        let lastDataBeforeOneDayAgo = data.filter(d => d.date < oneDayAgo).pop();
        if (!lastDataBeforeOneDayAgo) {
            lastDataBeforeOneDayAgo = { date: oneDayAgo, value: 0 };
        } else {
            lastDataBeforeOneDayAgo = { ...lastDataBeforeOneDayAgo, date: oneDayAgo };
        }

        let filteredData = data.filter(d => d.date >= oneDayAgo && d.date <= currentTime);

        filteredData.unshift(lastDataBeforeOneDayAgo);

        lastData = { ...data[data.length - 1], date: currentTime };
        if (filteredData.length === 1) {
            filteredData.push(lastData);
        } else {
            filteredData[filteredData.length - 1] = lastData;
        }

        data = filteredData;
    } else {
        xDomain = d3.extent(data, d => d.date);
    }

    const yDomain = [0, highestValue];

    const xScale = d3.scaleUtc().domain(xDomain).range([0, width]);
    const yScale = d3.scaleLinear().domain(yDomain).range([adjustedHeight, 0]);

    const start = xDomain[0];
    const end = xDomain[1];

    let tickCount = 10;

    switch (timeframe) {
        case 0:
            tickCount = 12;
            break;
        case 2:
            tickCount = 9;
            break;
        case 7:
            tickCount = 8;
            break;
        case 31:
            tickCount = 4;
            break;
        case 1825:
            tickCount = 6;
            break;
        case 3650:
            tickCount = 10;
            break;
        default:
            tickCount = 10;
            break;
    }

    const xTicks = calculateXTicks(start, end, tickCount);
    const yTicks = tickValues(highestValue, 9, 10);

    group.append('g')
        .attr('transform', `translate(${xPosition},${yPosition + adjustedHeight})`)
        .call(d3.axisBottom(xScale)
            .tickValues(xTicks)
            .tickFormat(getTickFormat(timeframe))
            .tickSize(0))
        .call(g => g.select('.domain').remove())
        .call(g => g.selectAll('.tick text')
            .attr('dy', '2.2em')
            .style('font-family', 'Montserrat')
            .style('font-size', '12px')
            .style('font-weight', '500')
            .style('line-height', '15px')
            .style('letter-spacing', '0.4285714030265808px')
            .style('fill', '#616161'));

    group.append('g')
        .attr('transform', `translate(${xPosition},${yPosition})`)
        .call(d3.axisLeft(yScale).tickSize(0).tickFormat(valueInThousands).tickValues(yTicks))
        .call(g => g.select('.domain').remove())
        .call(g => g.selectAll('.tick text')
            .attr('dx', '-1.5em')
            .style('font-family', 'Montserrat')
            .style('font-size', '12px')
            .style('font-weight', '500')
            .style('line-height', '15px')
            .style('letter-spacing', '0.4285714030265808px')
            .style('text-align', 'left')
            .style('fill', '#616161'))
        .call(g => g.selectAll('.tick line')
            .attr('stroke', '#E5E9EB')
            .attr('x2', width));

    if (only === true) {
        group.append('g')
            .attr('transform', `translate(${xPosition + width},${yPosition})`)
            .call(d3.axisRight(yScale).tickSize(0).tickFormat(valueInThousands).tickValues(yTicks))
            .call(g => g.select('.domain').remove())
            .call(g => g.selectAll('.tick text')
                .attr('dx', '1.5em')
                .style('font-family', 'Montserrat')
                .style('font-size', '12px')
                .style('font-weight', '500')
                .style('line-height', '15px')
                .style('letter-spacing', '0.4285714030265808px')
                .style('text-align', 'left')
                .style('fill', '#616161'))
            .call(g => g.selectAll('.tick line')
                .attr('stroke', '#E5E9EB')
                .attr('x2', -width));
    }

    const line = d3.line()
        .x(d => xScale(d.date) + xPosition)
        .y(d => yScale(d.close) + yPosition);

    const area = d3.area()
        .x(d => xScale(d.date) + xPosition)
        .y0(yScale.range()[0] + yPosition)
        .y1(d => yScale(d.close) + yPosition);

    const defs = group.append('defs');
    const gradient = defs.append('linearGradient')
        .attr('id', 'area-gradient')
        .attr('gradientUnits', 'userSpaceOnUse')
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '0%')
        .attr('y2', '100%');

    gradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', '#0C66E4')
        .attr('stop-opacity', 0.3);

    gradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', '#0C66E4')
        .attr('stop-opacity', 0);

    group.append('path')
        .datum(data)
        .attr('class', 'area')
        .attr('fill', 'url(#area-gradient)')
        .attr('d', area);

    const path = group.append('path')
        .datum(data)
        .attr('class', 'line')
        .attr('fill', 'none')
        .attr('stroke', '#0C66E4')
        .attr('stroke-width', 2)
        .attr('d', line);

    const totalLength = path.node().getTotalLength();

    path.attr('stroke-dasharray', totalLength + " " + totalLength)
        .attr('stroke-dashoffset', totalLength)
        .transition()
        .duration(2000)
        .attr('stroke-dashoffset', 0);


    if (timeframe != 0) {
        buildCircle(group, xPosition, yPosition, xScale, yScale, lastData);
    }


    buildTooltip(group, xPosition, yPosition, width, adjustedHeight, xScale, yScale, data);


    return;
};
