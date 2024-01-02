import { createRect, valueInThousands, tickValues, buildCircle } from '../helpers/helper.js';
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

export const buildProjectionChart = (group, width, height, xPosition, yPosition, only, data, lastData, highestValue, hasOverflow) => {
    const overflowWidth = hasOverflow ? 35 : 0;
    const adjustedWidth = width - overflowWidth;
    const overflowHeight = hasOverflow ? 35 : 0; // Altura del desbordamiento
    const adjustedHeight = height - overflowHeight; // Altura ajustada para el gráfico

    // Si hay desbordamiento, dibujar el área de desbordamiento primero
    if (hasOverflow) {
        const defs = group.append("defs");
        const pattern = defs.append("pattern")
            .attr("id", "diagonalStripes")
            .attr("width", 30)
            .attr("height", 30)
            .attr("patternUnits", "userSpaceOnUse")
            .attr("patternTransform", "rotate(45)");

        pattern.append("rect")
            .attr("width", 15)
            .attr("height", 30)
            .attr("fill", "#FFFFFF");

        pattern.append("rect")
            .attr("width", 15)
            .attr("height", 30)
            .attr("transform", "translate(15,0)")
            .attr("fill", "#ECECEC");

        // Aplicar el patrón al área de desbordamiento en la parte superior
        group.append('rect')
            .attr('x', xPosition)
            .attr('y', yPosition)
            .attr('width', width)
            .attr('height', overflowHeight)
            .attr('fill', "url(#diagonalStripes)");

        // Ajustar la posición y para el resto del gráfico
        yPosition += overflowHeight;
    }

    // Crear el fondo del gráfico en la posición ajustada
    createRect(group, xPosition, yPosition, width, adjustedHeight, '#FFFFFF');
    drawOuterLines(group, xPosition, yPosition, adjustedHeight, adjustedWidth, hasOverflow);
    if (hasOverflow) {
        drawOverflowRect(group, xPosition + adjustedWidth, yPosition, adjustedHeight, overflowHeight);
    }

    const today = new Date();
    // dummy data
    const generateProjections = generateDummyProjectionsData(today, '2033-01-01', lastData.close);
    const projectionData = generateProjections.map(p => ({
        startDate: new Date(p.start_date),
        endDate: new Date(p.end_date),
        minValue: p.min_value,
        maxValue: p.max_value
    }));
    // dummy data

    const xDomain = [today, d3.utcYear.offset(today, 10)];
    const yDomain = [0, highestValue];

    const xScale = d3.scaleUtc().domain(xDomain).range([0, adjustedWidth]);
    const yScale = d3.scaleLinear().domain(yDomain).range([adjustedHeight, 0]);

    const ticks = tickValues(highestValue, 9, 10);

    group.append('g')
        .attr('transform', `translate(${xPosition},${yPosition + adjustedHeight})`)
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

    group.append('g')
        .attr('transform', `translate(${xPosition + adjustedWidth},${yPosition})`)
        .call(d3.axisRight(yScale).tickSize(0).tickFormat(valueInThousands).tickValues(ticks))
        .call(g => g.select('.domain').remove())
        .call(g => g.selectAll('.tick text')
            .attr('dx', hasOverflow ? '4.5em' : '1.5em')
            .style('font-family', 'Montserrat')
            .style('font-size', '12px')
            .style('font-weight', '500')
            .style('line-height', '15px')
            .style('letter-spacing', '0.4285714030265808px')
            .style('text-align', 'left')
            .style('fill', '#D6D9DC'))
        .call(g => g.selectAll('.tick line')
            .attr('stroke', '#ECECEC')
            .attr('x2', -adjustedWidth));

    if (only === true) {
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

    populateChart(group, xPosition, yPosition, xScale, yScale, projectionData, lastData);

    if (hasOverflow) {
        // Define the pattern
        const defs = group.append("defs");
        const pattern = defs.append("pattern")
            .attr("id", "diagonalStripes")
            .attr("width", 30) // Aumenta el ancho del patrón para que las líneas sean menos frecuentes
            .attr("height", 30) // Aumenta el alto del patrón para que las líneas sean más grandes
            .attr("patternUnits", "userSpaceOnUse")
            .attr("patternTransform", "rotate(45)"); // Rotar el patrón 45 grados

        // Definir el primer rectángulo del patrón
        pattern.append("rect")
            .attr("width", 15) // Aumenta el ancho del rectángulo dentro del patrón
            .attr("height", 30) // El alto del rectángulo es igual al alto del patrón
            .attr("transform", "translate(0,0)") // No necesita traslación, comienza en 0,0
            .attr("fill", "#FFFFFF"); // Color blanco

        // Definir el segundo rectángulo del patrón
        pattern.append("rect")
            .attr("width", 15) // Aumenta el ancho del rectángulo
            .attr("height", 30) // El alto del rectángulo es igual al alto del patrón
            .attr("transform", "translate(15,0)") // Trasladar a la derecha del primer rectángulo
            .attr("fill", "#ECECEC"); // Color gris claro

        // Aplicar el patrón al rectángulo de desbordamiento
        group.append('rect')
            .attr('x', xPosition + adjustedWidth)
            .attr('y', yPosition)
            .attr('width', overflowWidth)
            .attr('height', adjustedHeight + 1)
            .attr('fill', "url(#diagonalStripes)");
    }


    if (only === true) {
        buildCircle(group, xPosition, yPosition, xScale, yScale, lastData, true);
    }

    return;
};

const drawOuterLines = (group, xPosition, yPosition, height, width, hasOverflow) => {
    const horizontalLine = group.append('line')
        .attr('x1', xPosition)
        .attr('y1', yPosition + height + 12)
        .attr('x2', xPosition)
        .attr('y2', yPosition + height + 12)
        .attr('stroke', '#BDC2C7')
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
            .attr('stroke', '#BDC2C7')
            .attr('stroke-width', 1.5)
            .transition()
            .duration(500)
            .attr('x2', xPosition + width - 6 + offsetX) // Finalizar con la línea inclinada hacia la derecha
            .attr('y2', yPosition + height + 12 - offsetY);
    }

    const xPositionAdjusted = hasOverflow ? xPosition + 35 : xPosition;

    const verticalLine = group.append('line')
        .attr('x1', xPositionAdjusted + width + 10)
        .attr('y1', yPosition + height)
        .attr('x2', xPositionAdjusted + width + 10)
        .attr('y2', yPosition + height)
        .attr('stroke', '#BDC2C7')
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

        // Comienza con una línea de longitud cero (o muy pequeña)
        const inclinedLine = group.append('line')
            .attr('x1', xPositionAdjusted + width + 10 + offsetX / 2)
            .attr('y1', yPosition + 6 + offsetY / 2)
            .attr('x2', xPositionAdjusted + width + 10 + offsetX / 2) // Punto inicial igual a x1
            .attr('y2', yPosition + 6 + offsetY / 2) // Punto inicial igual a y1
            .attr('stroke', '#BDC2C7')
            .attr('stroke-width', 1.5);

        // Anima la línea hasta alcanzar la longitud y orientación deseadas
        inclinedLine.transition()
            .duration(500)
            .attr('x2', xPositionAdjusted + width + 5) // Punto final en X
            .attr('y2', yPosition + 3 - offsetY / 2); // Punto final en Y
    }

};

const populateChart = (group, xPosition, yPosition, xScale, yScale, projectionData, lastData) => {
    const defs = group.append('defs');

    projectionData.forEach((p, i) => {
        const xStart = xScale(p.startDate) + xPosition;
        const xEnd = xScale(p.endDate) + xPosition;
        const yMax = yScale(p.maxValue) + yPosition;
        const yMin = yScale(p.minValue) + yPosition;
        const yLastDatum = yScale(lastData.close) + yPosition;

        // Crear un id único para cada gradiente
        const gradientId = `gradient-${i}`;

        const offset = ((yLastDatum - yMax) / (yMin - yMax)) * 100;

        const gradient = defs.append('linearGradient')
            .attr('id', gradientId)
            .attr('x1', '0%')
            .attr('x2', '0%')
            .attr('y1', '0%')
            .attr('y2', '100%');

        gradient.append('stop')
            .attr('offset', `${Math.max(0, offset - 0.1)}%`)
            .attr('stop-color', '#24C6C8');

        gradient.append('stop')
            .attr('offset', `${offset}%`)
            .attr('stop-color', '#24C6C8');
        gradient.append('stop')
            .attr('offset', `${offset}%`)
            .attr('stop-color', '#ED5666');

        gradient.append('stop')
            .attr('offset', `${Math.min(100, offset + 0.1)}%`)
            .attr('stop-color', '#ED5666');

        const rectHeight = yMin - yMax;
        const maxBorderRadius = 5;
        const borderRadius = Math.min(maxBorderRadius, rectHeight / 2)

        const rect = group.append('rect')
            .attr('x', xStart)
            .attr('width', xEnd - xStart)
            .attr('y', yMin)
            .attr('height', 0)
            .attr('fill', `url(#${gradientId})`)
            .attr('rx', borderRadius)
            .attr('ry', borderRadius);

        rect.transition()
            .duration(1000)
            .delay(i * 50)
            .attr('y', yMax)
            .attr('height', rectHeight);
    });
};

const drawOverflowRect = (group, xPosition, yPosition, height, width) => {
    // Dibuja la línea horizontal y la línea inclinada al final de la animación
    const horizontalLine = group.append('line')
        .attr('x1', xPosition)
        .attr('y1', yPosition + height + 12)
        .attr('x2', xPosition) // comienza en la posición X inicial
        .attr('y2', yPosition + height + 12)
        .attr('stroke', '#BDC2C7')
        .attr('stroke-width', 1.5);

    // Anima la línea horizontal desde la posición inicial hasta el ancho especificado
    horizontalLine.transition()
        .duration(1500)
        .attr('x2', xPosition + width) // termina en la posición X final
        .on('end', drawInclinedLine); // al final de la animación, dibuja la línea inclinada

    function drawInclinedLine() {
        const inclineLength = 12;
        const angle = 65;
        const angleRadians = (angle * Math.PI) / 180;
        const halfIncline = inclineLength / 2;
        const offsetX = Math.cos(angleRadians) * halfIncline;
        const offsetY = Math.sin(angleRadians) * halfIncline;

        // Dibuja la línea inclinada al comienzo de la línea horizontal
        group.append('line')
            .attr('x1', xPosition + offsetX)
            .attr('y1', yPosition + height + 12 - offsetY)
            .attr('x2', xPosition + offsetX) // comienza donde termina la línea horizontal
            .attr('y2', yPosition + height + 12 - offsetY)
            .attr('stroke', '#BDC2C7')
            .attr('stroke-width', 1.5)
            .transition()
            .duration(500)
            .attr('x2', xPosition - offsetX) // termina desplazándose hacia la izquierda
            .attr('y2', yPosition + height + 12 + offsetY); // y hacia abajo debido al ángulo negativo
    }


    // vertical line
    const xPositionAdjusted = xPosition + 5;

    const verticalLine = group.append('line')
        .attr('x1', xPositionAdjusted + width + 5)
        .attr('y1', 20)
        .attr('x2', xPositionAdjusted + width + 5)
        .attr('y2', 20) // Comienza con y2 en el mismo punto que y1 para que la línea "crezca" desde ese punto
        .attr('stroke', '#BDC2C7')
        .attr('stroke-width', 1.5);

    verticalLine.transition()
        .duration(1500)
        .attr('y2', yPosition) // Punto final en Y
        .on('end', () => drawInclinedLineY(group, xPositionAdjusted + width + 5, yPosition));

        function drawInclinedLineY() {
            const inclineLength = 10;
            const angle = 2;
            const angleRadians = (angle * Math.PI) / 180;
        
            const offsetX = Math.cos(angleRadians) * inclineLength;
            const offsetY = Math.sin(angleRadians) * inclineLength;
        
            // Define el punto de inicio de la línea en su posición final
            const inclinedLine = group.append('line')
                .attr('x1', xPositionAdjusted + width + 5 - offsetX / 2)
                .attr('y1', yPosition - 1 + offsetY / 2)
                .attr('x2', xPositionAdjusted + width + 5 - offsetX / 2) // Punto inicial en X igual a x1
                .attr('y2', yPosition - 1 + offsetY / 2) // Punto inicial en Y igual a y1
                .attr('stroke', '#BDC2C7')
                .attr('stroke-width', 1.5);
        
            // Anima la línea hacia atrás hasta alcanzar la longitud y orientación deseadas
            inclinedLine.transition()
                .duration(500)
                .attr('x2', xPositionAdjusted + width + 5 + offsetX / 2) // Punto final en X
                .attr('y2', yPosition + 2 - offsetY / 2); // Punto final en Y
        }
        

};

