import { createRect, valueInThousands, tickValues, buildCircle, calculateXTicks, getTickFormat, buildTooltip, abbreviateNumber } from '../helpers/helper.js';
import { generateDummyProjectionsData } from '../helpers/dummyData.js';
/**
 * Se encarga de construir el gráfico de proyección.
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

export const buildProjectionChart = (group, width, height, xPosition, yPosition, only, data, lastData, highestValue, hasOverflow, timeframe) => {
    const overflowWidth = hasOverflow ? 22 : 0;
    const adjustedWidth = width - overflowWidth;
    const overflowHeight = 22;
    const adjustedHeight = height - overflowHeight;

    const defs = group.append("defs");
    const pattern = defs.append("pattern")
        .attr("id", "diagonalStripes")
        .attr("width", 20)
        .attr("height", 20)
        .attr("patternUnits", "userSpaceOnUse")
        .attr("patternTransform", "rotate(45)");

    pattern.append("rect")
        .attr("width", 10)
        .attr("height", 20)
        .attr("fill", "#EAEAEA");

    pattern.append("rect")
        .attr("width", 10)
        .attr("height", 20)
        .attr("transform", "translate(10,0)")
        .attr("fill", "#EFEFEF");


    yPosition += overflowHeight;

    createRect(group, xPosition, yPosition, width, adjustedHeight, '#FFFFFF');
    drawOuterLines(group, xPosition, yPosition, adjustedHeight, adjustedWidth, hasOverflow);
    drawOverflowRect(group, xPosition + adjustedWidth, yPosition, adjustedHeight, overflowHeight, hasOverflow);

    const today = timeframe === 0 ? new Date(new Date().getFullYear(), 0, 1) : new Date();
    const todayTo = timeframe === 0 ? new Date(new Date().getFullYear(), 11, 31) : d3.utcDay.offset(today, timeframe == 2 ? 1 : timeframe);

    const generateProjections = generateDummyProjectionsData(today, todayTo, lastData.close);

    const projectionData = generateProjections.map(p => ({
        startDate: new Date(p.start_date),
        endDate: new Date(p.end_date),
        minValue: p.min_value,
        maxValue: p.max_value
    }));


    const xDomain = [today, todayTo];
    const yDomain = [0, highestValue];

    const xScale = d3.scaleUtc().domain(xDomain).range([0, adjustedWidth]);
    const yScale = d3.scaleLinear().domain(yDomain).range([adjustedHeight, 0]);

    const start = xDomain[0];
    const end = xDomain[1];

    const shouldOmitFirstTick = !only && [0, 2, 7, 31].includes(timeframe);

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

    const xTicks = calculateXTicks(today, end, tickCount, shouldOmitFirstTick);
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
        .attr('transform', `translate(${xPosition + adjustedWidth},${yPosition})`)
        .call(d3.axisRight(yScale).tickSize(0).tickFormat(valueInThousands).tickValues(yTicks))
        .call(g => g.select('.domain').remove())
        .call(g => g.selectAll('.tick text')
            .attr('dx', hasOverflow ? '3.1em' : '1.5em')
            .style('font-family', 'Montserrat')
            .style('font-size', '12px')
            .style('font-weight', '500')
            .style('line-height', '15px')
            .style('letter-spacing', '0.4285714030265808px')
            .style('text-align', 'left')
            .style('fill', '#616161'))
        .call(g => g.selectAll('.tick line')
            .attr('stroke', '#ECECEC')
            .attr('x2', -adjustedWidth));

    const yCenterOverflow = overflowHeight / 2;

    const overflowGroup = group.append('g')
        .attr('transform', `translate(${xPosition},${yPosition - overflowHeight})`);

    overflowGroup.append('rect')
        .attr('width', width)
        .attr('height', overflowHeight)
        .attr('fill', "url(#diagonalStripes)");

    if (only === true) {
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
                .attr('stroke', '#ECECEC')
                .attr('x2', adjustedWidth));
    } else {
        const defs = group.append("defs");
        const pattern = defs.append("pattern")
            .attr("id", "splitPattern")
            .attr("width", 10)
            .attr("height", 10)
            .attr("patternUnits", "userSpaceOnUse");
        pattern.append("rect")
            .attr("width", 10)
            .attr("height", 5)
            .attr("transform", "translate(0,0)")
            .attr("fill", "#293C4B");
        pattern.append("rect")
            .attr("width", 10)
            .attr("height", 5)
            .attr("transform", "translate(0,5)")
            .attr("fill", "#FFFFFF");

        group.append("line")
            .attr("x1", xPosition)
            .attr("y1", yPosition)
            .attr("x2", xPosition)
            .attr("y2", yPosition + adjustedHeight)
            .attr("stroke", "url(#splitPattern)")
            .attr("stroke-width", 2);
    }

    let lateralOverflowGroup = null;
    let xCenterLateralOverflow = null;
    let squareOverflowGroup = null;

    if (hasOverflow) {
        lateralOverflowGroup = group.append('g')
            .attr('transform', `translate(${xPosition + adjustedWidth},${yPosition})`);
        lateralOverflowGroup.append('rect')
            .attr('width', overflowWidth)
            .attr('height', adjustedHeight + 1)
            .attr('fill', "url(#diagonalStripes)");
        xCenterLateralOverflow = overflowWidth / 2;

        squareOverflowGroup = drawTopRightOverflowRect(group, xPosition, yPosition, overflowHeight, overflowWidth, width);
    }


    populateChart(group, xPosition, yPosition, xScale, yScale, projectionData, lastData, highestValue, start, end, overflowGroup, yCenterOverflow, lateralOverflowGroup, xCenterLateralOverflow, squareOverflowGroup);

    if (only === true && timeframe !== 0) {
        if (timeframe === 2 || timeframe === 7 || timeframe === 31) {
            // we need to change the date of the last data using the first date of the scale x axis
            lastData.date = xScale.invert(0);
        }
        buildCircle(group, xPosition, yPosition, xScale, yScale, lastData, true);
    }

    if (timeframe === 0) {
        const groupLine = d3.line()
            .x(d => xScale(d.date) + xPosition)
            .y(d => yScale(d.close) + yPosition);
        const path = group.append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', '#0C66E4')
            .attr('stroke-width', 2)
            .attr('d', groupLine);

        const totalLength = path.node().getTotalLength();

        path.attr('stroke-dasharray', totalLength + " " + totalLength)
            .attr('stroke-dashoffset', totalLength)
            .transition()
            .delay(2000)
            .duration(2000)
            .attr('stroke-dashoffset', 0);

        buildCircle(group, xPosition, yPosition, xScale, yScale, lastData, false, 3000);
        buildTooltip(group, xPosition, yPosition, width, adjustedHeight, xScale, yScale, data);
    }

    return;
};

const drawOuterLines = (group, xPosition, yPosition, height, width, hasOverflow) => {
    const horizontalLine = group.append('line')
        .attr('x1', xPosition + 5)
        .attr('y1', yPosition + height + 12)
        .attr('x2', xPosition + 5)
        .attr('y2', yPosition + height + 12)
        .attr('stroke', '#616161')
        .attr('stroke-width', 1.5);

    horizontalLine.transition()
        .duration(1500)
        .attr('x2', xPosition + width - 6)
        .on('end', drawInclinedLine);

    function drawInclinedLine() {
        const inclineLength = 12;
        const angle = 65;
        const angleRadians = (angle * Math.PI) / 180;
        const halfIncline = inclineLength / 2;
        const offsetX = Math.cos(angleRadians) * halfIncline;
        const offsetY = Math.sin(angleRadians) * halfIncline;

        group.append('line')
            .attr('x1', xPosition + width - 6 - offsetX)
            .attr('y1', yPosition + height + 12 + offsetY)
            .attr('x2', xPosition + width - 6 - offsetX) // Comenzar con la línea vertical coincidiendo con la horizontal
            .attr('y2', yPosition + height + 12 + offsetY)
            .attr('stroke', '#616161')
            .attr('stroke-width', 1.5)
            .transition()
            .duration(500)
            .attr('x2', xPosition + width - 6 + offsetX) // Finalizar con la línea inclinada hacia la derecha
            .attr('y2', yPosition + height + 12 - offsetY);
    }

    const xPositionAdjusted = hasOverflow ? xPosition + 22 : xPosition;

    const verticalLine = group.append('line')
        .attr('x1', xPositionAdjusted + width + 10)
        .attr('y1', yPosition + height)
        .attr('x2', xPositionAdjusted + width + 10)
        .attr('y2', yPosition + height)
        .attr('stroke', '#616161')
        .attr('stroke-width', 1.5);

    verticalLine.transition()
        .duration(1500)
        .attr('y2', yPosition + 4)
        .on('end', drawInclinedLineY);

    function drawInclinedLineY() {
        const inclineLength = 10;
        const angle = 2;
        const angleRadians = (angle * Math.PI) / 180;

        const offsetX = Math.cos(angleRadians) * inclineLength;
        const offsetY = Math.sin(angleRadians) * inclineLength;

        const inclinedLine = group.append('line')
            .attr('x1', xPositionAdjusted + width + 10 + offsetX / 2)
            .attr('y1', yPosition + 6 + offsetY / 2)
            .attr('x2', xPositionAdjusted + width + 10 + offsetX / 2)
            .attr('y2', yPosition + 6 + offsetY / 2)
            .attr('stroke', '#616161')
            .attr('stroke-width', 1.5);

        inclinedLine.transition()
            .duration(500)
            .attr('x2', xPositionAdjusted + width + 5)
            .attr('y2', yPosition + 3 - offsetY / 2);
    }

};

const populateChart = (group, xPosition, yPosition, xScale, yScale, projectionData, lastData, highestValue, start, end, overflowGroup, yCenterOverflow, lateralOverflowGroup, xCenterLateralOverflow, squareOverflowGroup) => {
    const defs = group.append('defs');
    const maxWidth = 10;
    projectionData.forEach((p, i) => {
        if (p.startDate.getTime() === p.endDate.getTime() && p.minValue === p.maxValue) {
            return;
        }

        if (p.minValue > highestValue || p.startDate < start) {
            if (p.minValue > highestValue) {
                overflowGroup.append('circle')
                    .attr('cx', xScale(p.startDate))
                    .attr('cy', yCenterOverflow)
                    .attr('r', 5)
                    .attr('fill', 'red');
            }
            return;
        }

        if (p.startDate > end && lateralOverflowGroup) {
            lateralOverflowGroup.append('circle')
                .attr('cx', xCenterLateralOverflow)
                .attr('cy', yScale(p.maxValue) + yPosition)
                .attr('r', 5)
                .attr('fill', 'red');
        }

        const xStart = xScale(p.startDate) + xPosition;
        const xEnd = xScale(p.endDate > end ? end : p.endDate) + xPosition;
        const width = 2.5;
        const yMax = yScale(p.maxValue > highestValue ? highestValue : p.maxValue) + yPosition;
        const yMin = yScale(p.minValue) + yPosition;
        const yLastDatum = yScale(lastData.close) + yPosition;

        const gradientId = `gradient-${i}`;
        const offset = ((yLastDatum - yMax) / (yMin - yMax)) * 100;

        const yMid = (yMax + yMin) / 2;

        const circleColor = yMid >= yLastDatum ? '#F76659' : '#1ED36F';

        const gradient = defs.append('linearGradient')
            .attr('id', gradientId)
            .attr('x1', '0%')
            .attr('x2', '0%')
            .attr('y1', '0%')
            .attr('y2', '100%');

        gradient.append('stop')
            .attr('offset', `${Math.max(0, offset - 0.1)}%`)
            .attr('stop-color', '#1ED36F');

        gradient.append('stop')
            .attr('offset', `${offset}%`)
            .attr('stop-color', '#1ED36F');
        gradient.append('stop')
            .attr('offset', `${offset}%`)
            .attr('stop-color', '#F76659');

        gradient.append('stop')
            .attr('offset', `${Math.min(100, offset + 0.1)}%`)
            .attr('stop-color', '#F76659');

        const rectHeight = yMin - yMax;
        const maxBorderRadius = 5;
        const borderRadius = Math.min(maxBorderRadius, rectHeight / 2);

        const rect = group.append('rect')
            .attr('x', xStart + (xEnd - xStart) / 2 - width / 2) // Centra el rectángulo
            .attr('width', width)
            .attr('y', yMin)
            .attr('height', 0)
            .attr('fill', `url(#${gradientId})`)
            .attr('rx', borderRadius)
            .attr('ry', borderRadius);
        // .datum(p)
        // .on('mouseover', (event, d) => {
        //     const [x, y] = d3.pointer(event);
        //     showTooltipProjection(d, x + window.scrollX, y + window.scrollY);
        // })
        // .on('mouseout', hideTooltipProjection);

        rect.transition()
            .duration(1000)
            .delay(i * 50)
            .attr('y', yMax)
            .attr('height', rectHeight);

        const middleCircle = group.append('circle')
            .attr('cx', (xStart + xEnd) / 2)
            .attr('cy', yMid)
            .attr('r', 0) // El radio puede ser ajustado según necesites
            .attr('fill', circleColor)
            .datum(p)
            .on('mouseover', (event, d) => {
                const [x, y] = d3.pointer(event);
                showTooltipProjection(d, x + window.scrollX, y + window.scrollY);
            })
        .on('mouseout', hideTooltipProjection);

        middleCircle.transition()
            .duration(1000)
            .delay(i * 70)
            .attr('r', 3);
    });

    projectionData.forEach((p, i) => {
        if (p.startDate.getTime() !== p.endDate.getTime() || p.minValue !== p.maxValue) {
            return;
        }

        if (p.minValue > highestValue && p.startDate > end && squareOverflowGroup) {
            squareOverflowGroup.append('circle')
                .attr('cx', xCenterLateralOverflow)
                .attr('cy', yCenterOverflow)
                .attr('r', 2)
                .attr('fill', '#24C6C8')
                .datum(p)
        } else if (p.minValue > highestValue || p.startDate < start) {
            overflowGroup.append('circle')
                .attr('cx', xScale(p.startDate))
                .attr('cy', yCenterOverflow)
                .attr('r', 2)
                .attr('fill', '#24C6C8');
        } else if (p.startDate > end && lateralOverflowGroup) {
            lateralOverflowGroup.append('circle')
                .attr('cx', xCenterLateralOverflow)
                .attr('cy', yScale(p.maxValue))
                .attr('r', 2)
                .attr('fill', lastData.close > p.maxValue ? '#F76659' : '#24C6C8');
        }

        const xStart = xScale(p.startDate) + xPosition;
        const yMax = yScale(p.maxValue) + yPosition;

        const circleProjection = group.append('circle')
            .attr('cx', xStart)
            .attr('cy', yMax + 30)
            .attr('r', 0)
            .attr('fill', lastData.close > p.maxValue ? '#F76659' : '#1ED36F')
            .datum(p)
            .on('mouseover', (event, d) => {
                const [x, y] = d3.pointer(event);
                showTooltipProjection(d, x + window.scrollX, y + window.scrollY);
            })
            .on('mouseout', hideTooltipProjection);

        circleProjection.transition()
            .duration(1000)
            .delay(i * 50)
            .attr('r', 3)
            .attr('cy', yMax);
    });
};

const drawOverflowRect = (group, xPosition, yPosition, height, width, hasOverflow) => {
    if (hasOverflow) {

        const horizontalLine = group.append('line')
            .attr('x1', xPosition)
            .attr('y1', yPosition + height + 12)
            .attr('x2', xPosition)
            .attr('y2', yPosition + height + 12)
            .attr('stroke', '#616161')
            .attr('stroke-width', 1.5);

        horizontalLine.transition()
            .duration(1500)
            .attr('x2', xPosition + width)
            .on('end', drawInclinedLine);

        function drawInclinedLine() {
            const inclineLength = 12;
            const angle = 65;
            const angleRadians = (angle * Math.PI) / 180;
            const halfIncline = inclineLength / 2;
            const offsetX = Math.cos(angleRadians) * halfIncline;
            const offsetY = Math.sin(angleRadians) * halfIncline;

            group.append('line')
                .attr('x1', xPosition + offsetX)
                .attr('y1', yPosition + height + 12 - offsetY)
                .attr('x2', xPosition + offsetX)
                .attr('y2', yPosition + height + 12 - offsetY)
                .attr('stroke', '#616161')
                .attr('stroke-width', 1.5)
                .transition()
                .duration(500)
                .attr('x2', xPosition - offsetX)
                .attr('y2', yPosition + height + 12 + offsetY);
        }
    }

    const xPositionAdjusted = xPosition + 5;
    const widthAdjusted = hasOverflow ? width + 5 : 5;

    const verticalLine = group.append('line')
        .attr('x1', xPositionAdjusted + widthAdjusted)
        .attr('y1', 20)
        .attr('x2', xPositionAdjusted + widthAdjusted)
        .attr('y2', 20)
        .attr('stroke', '#616161')
        .attr('stroke-width', 1.5);

    verticalLine.transition()
        .duration(1500)
        .attr('y2', yPosition)
        .on('end', () => drawInclinedLineY(group, xPositionAdjusted + widthAdjusted, yPosition));

    function drawInclinedLineY() {
        const inclineLength = 10;
        const angle = 2;
        const angleRadians = (angle * Math.PI) / 180;

        const offsetX = Math.cos(angleRadians) * inclineLength;
        const offsetY = Math.sin(angleRadians) * inclineLength;

        const inclinedLine = group.append('line')
            .attr('x1', xPositionAdjusted + widthAdjusted - offsetX / 2)
            .attr('y1', yPosition - 1 + offsetY / 2)
            .attr('x2', xPositionAdjusted + widthAdjusted - offsetX / 2)
            .attr('y2', yPosition - 1 + offsetY / 2)
            .attr('stroke', '#616161')
            .attr('stroke-width', 1.5);

        inclinedLine.transition()
            .duration(500)
            .attr('x2', xPositionAdjusted + widthAdjusted + offsetX / 2)
            .attr('y2', yPosition + 2 - offsetY / 2);
    }
};

const drawTopRightOverflowRect = (group, xPosition, yPosition, overflowHeight, overflowWidth, width) => {
    const topRightOverflowGroup = group.append('g')
        .attr('transform', `translate(${xPosition + width - overflowWidth},${yPosition - overflowHeight})`);

    topRightOverflowGroup.append('rect')
        .attr('width', overflowWidth)
        .attr('height', overflowHeight)
        .attr('fill', "url(#diagonalStripes)");

    return topRightOverflowGroup;
};


const createTooltipProjection = () => {
    // Crear y seleccionar el tooltip si ya existe
    let tooltip = d3.select('body').selectAll('.tooltip-projection').data([null]);
    tooltip = tooltip.enter()
        .append('div')
        .attr('class', 'tooltip-projection')
        .style('position', 'absolute')
        .style('background-color', '#FFFFFF')
        .style('padding', '16px 24px')
        .style('box-shadow', '0 8px 16px 0 rgba(0, 0, 0, 0.12)')
        .style('font-family', 'Montserrat, sans-serif')
        .style('pointer-events', 'none')
        .style('opacity', 0)
        .style('transition', 'opacity 0.2s')
        .style('display', 'flex')
        .style('flex-direction', 'column')
        .style('align-items', 'flex-start')
        .style('gap', '5px')
        .style('border-radius', '20px')
        .style('background', 'linear-gradient(100deg, #FBFBFF 6.9%, rgba(255, 255, 255, 0.83) 84.24%)')
        .merge(tooltip);

    // Contenedor padre que alinea elementos en columna
    const container = tooltip.append('div')
        .style('display', 'flex')
        .style('flex-direction', 'column')
        .style('align-items', 'flex-start')
        .style('gap', '8px');

    // Contenedor superior que tiene una estructura de fila
    const topContainer = container.append('div')
        .style('display', 'flex')
        .style('flex-direction', 'row')
        .style('justify-content', 'start')
        .style('align-items', 'center')
        .style('width', '100%'); // Asegúrate de establecer un ancho

    // Contenedor izquierdo en el superior para la imagen redondeada
    const leftTopContainer = topContainer.append('div')
        .style('border-radius', '50%')
        .style('width', '32px')
        .style('height', '32px')
        .style('overflow', 'hidden');

    const gender = Math.random() < 0.5 ? 'men' : 'women';
    const imageIndex = Math.floor(Math.random() * 99) + 1;

    leftTopContainer.append('img')
        .attr('src', `https://randomuser.me/api/portraits/${gender}/${imageIndex}.jpg`)
        .style('width', '100%')
        .style('height', '100%')
        .style('style', 'object-fit: cover');

    // Contenedor derecho en el superior para título y subtítulo
    const rightTopContainer = topContainer.append('div')
        .style('display', 'flex')
        .style('justify-content', 'center')
        .style('margin-left', '5px')
        .style('flex-direction', 'column')
        .style('height', '32px');

    rightTopContainer.append('div')
        .attr('class', 'tooltip-title')
        .style('font-size', '16px')
        .style('font-weight', '400')
        .style('line-height', '1')
        .style('color', '#212529')
        .style('text-align', 'left')
        .style('font-family', 'Montserrat')

    rightTopContainer.append('div')
        .attr('class', 'tooltip-subtitle')
        .style('font-size', '12px')
        .style('font-weight', '500')
        .style('line-height', '1')
        .style('color', '#212529')
        .style('text-align', 'left')
        .style('font-family', 'Montserrat')
        .style('letter-spacing', '0.429px')

    // Contenedor inferior para el contenido, con dos divisiones
    const bottomContainer = container.append('div')
        .style('display', 'flex')
        .style('margin-top', '16px') // Espacio entre el contenedor superior e inferior
        .style('flex-direction', 'row')
        .style('justify-content', 'space-between') // Asegura que los hijos se distribuyan a lo largo del contenedor
        .style('width', '100%');

    // Subcontenedor izquierdo que incluirá el título y el contenido para "valuation range"
    const leftBottomContainer = bottomContainer.append('div')
        .style('display', 'flex')
        .style('margin-right', '16px') // Espacio entre los subcontenedores
        .style('flex-direction', 'column') // Organiza los hijos en columna
        .style('align-items', 'flex-start'); // Alinea los hijos al inicio del contenedor

    // Título para "valuation range"
    leftBottomContainer.append('div')
        .attr('class', 'valuation-range-title')
        .text('VALUATION RANGE') // Texto de ejemplo para el título
        .style('font-size', '10px')
        .style('font-weight', '700')
        .style('line-height', '12px')
        .style('margin-bottom', '4px') // Espacio entre el título y el contenido
        .style('text-transform', 'uppercase');

    // Contenido para "valuation range"
    leftBottomContainer.append('div')
        .attr('class', 'valuation-range-value')
        .text('$30B') // Texto de ejemplo para el contenido
        .style('font-size', '16px')
        .style('font-family', 'Montserrat')
        .style('font-weight', '400') // Peso de la fuente para el contenido
        .style('line-height', '24px'); // Line height para el contenido

    // Subcontenedor derecho que incluirá el título y el contenido para "date range"
    const rightBottomContainer = bottomContainer.append('div')
        .style('display', 'flex')
        .style('flex-direction', 'column') // Organiza los hijos en columna
        .style('align-items', 'flex-start'); // Alinea los hijos al inicio del contenedor

    // Título para "date range"
    rightBottomContainer.append('div')
        .attr('class', 'date-range-title')
        .text('DATE RANGE') // Texto de ejemplo para el título
        .style('font-size', '10px')
        .style('font-weight', '700')
        .style('line-height', '12px')
        .style('margin-bottom', '4px') // Espacio entre el título y el contenido
        .style('text-transform', 'uppercase');

    // Contenido para "date range"
    rightBottomContainer.append('div')
        .attr('class', 'date-range-value')
        .text('2020 → 2023') // Texto de ejemplo para el contenido
        .style('font-size', '16px')
        .style('font-family', 'Montserrat')
        .style('font-weight', '400') // Peso de la fuente para el contenido
        .style('line-height', '24px'); // Line height para el contenido

    return tooltip;
};

const showTooltipProjection = (d, x, y) => {
    tooltip.select('.tooltip-title').text('Monica Smith');
    tooltip.select('.tooltip-subtitle').text('Asesora de marketing digital');

    let min = Math.round(d.minValue / 1000) * 1000;
    let max = Math.round(d.maxValue / 1000) * 1000;

    let isValueEqual = min === max;
    let isDateEqual = d.startDate.getFullYear() === d.endDate.getFullYear();

    let value = isValueEqual ? `$${abbreviateNumber(min)}` : `$${abbreviateNumber(min)} - $${abbreviateNumber(max)}`;
    let date = isDateEqual ? `${d.startDate.getFullYear()}` : `${d.startDate.getFullYear()} → ${d.endDate.getFullYear()}`;

    tooltip.select('.valuation-range-value').text(value);
    tooltip.select('.date-range-value').text(date);

    tooltip.style('opacity', 1)
        .style('left', `${x - 250}px`)
        .style('top', `${y - 150}px`);
};

const tooltip = createTooltipProjection();

const hideTooltipProjection = () => {
    tooltip.transition().style('opacity', 0);
};
