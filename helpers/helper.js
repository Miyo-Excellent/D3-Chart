/**
 * Crea un elemento rectángulo en el grupo SVG proporcionado.
 * 
 * @param {d3.Selection} group Selección D3 del elemento de grupo donde se dibujará el rectángulo.
 * @param {number} x Coordenada x del rectángulo.
 * @param {number} y Coordenada y del rectángulo.
 * @param {number} width Ancho del rectángulo.
 * @param {number} height Altura del rectángulo.
 * @param {string} fill Color de relleno del rectángulo.
 */
export const createRect = (group, x, y, width, height, fill) => {
    group.append('rect')
        .attr('x', x)
        .attr('y', y)
        .attr('width', width)
        .attr('height', height)
        .attr('fill', fill);
};

/**
 * Formatea un número para mostrarlo en miles con el símbolo de dólar.
 *
 * @param {number} d Valor a formatear.
 * @returns {string} Valor formateado como una cadena de texto.
 */

export const valueInThousands = d => {
    if (d === 0) {
        return "$0K";
    }
    const valueInThousands = d / 1000;
    return `$${valueInThousands.toFixed(1)}K`;
};

/**
 * Genera un conjunto de valores para los ticks del eje, basado en el valor más alto y la cantidad deseada de ticks.
 *
 * @param {number} highestValue El valor más alto en el conjunto de datos.
 * @param {number} tickCount La cantidad de ticks a generar.
 * @param {number} length La longitud del array de ticks.
 * @returns {number[]} Un array de valores para los ticks.
 */

export const tickValues = (highestValue, tickCount, length) => {
    const tickInterval = highestValue / tickCount;
    return Array.from({ length: length }, (_, i) => i * tickInterval);
}

/**
 * Construye un círculo con animación para representar el último punto de datos en el gráfico.
 *
 * @param {d3.Selection} group Grupo SVG donde se añadirá el círculo.
 * @param {number} xPosition Posición en x donde se colocará el círculo.
 * @param {number} yPosition Posición en y donde se colocará el círculo.
 * @param {d3.ScaleTime} xScale Escala de tiempo de D3 utilizada para el eje X.
 * @param {d3.ScaleLinear} yScale Escala lineal de D3 utilizada para el eje Y.
 * @param {Object} lastData Último conjunto de datos para determinar la posición del círculo.
 * @param {boolean} [isProjection=false] Indica si el círculo representa una proyección futura (no real).
 * @param {number} [delay=1000] Retraso antes de que comience la animación del círculo.
 */

export const buildCircle = (group, xPosition, yPosition, xScale, yScale, lastData, isProjection = false, delay = 1000) => {

    // Circle
    const outerRingRadius = 9;
    const innerCircleRadius = 4.5;
    const circleX = xScale(lastData.date) + xPosition + (isProjection ? 10 : 0);
    const circleY = yScale(lastData.close) + yPosition;

    const outerRing = group.append('circle')
        .attr('cx', circleX)
        .attr('cy', circleY)
        .attr('r', 0)
        .attr('fill', '#fff')
        // .attr('stroke', '#17A2B8')
        .attr('stroke-width', 0)
        .attr('fill-opacity', 0.8);

    // Outer ring animation
    outerRing.transition()
        .delay(delay != 1000 ? delay : 0)
        .duration(3000)
        .attr('r', outerRingRadius);

    const innerCircle = group.append('circle')
        .attr('cx', circleX)
        .attr('cy', circleY)
        .attr('r', 0)
        .attr('fill', '#0C66E4');

    // Inner circle animation
    innerCircle.transition()
        .duration(1000)
        .delay(delay)
        .attr('r', innerCircleRadius);
}

/**
 * Calcula los ticks para el eje X basándose en el rango de tiempo y la cantidad de ticks deseada.
 *
 * @param {Date} start Fecha de inicio del intervalo de tiempo.
 * @param {Date} end Fecha de finalización del intervalo de tiempo.
 * @param {number} numTicks Número deseado de ticks.
 * @param {boolean} [omitFirstTick=false] Si se debe omitir el primer tick.
 * @returns {Date[]} Un array de fechas representando los ticks para el eje X.
 */

export function calculateXTicks(start, end, numTicks, omitFirstTick = false) {
    var interval = (end - start) / (numTicks - 1);
    var ticks = [];

    for (var i = omitFirstTick ? 1 : 0; i < numTicks; i++) {
        ticks.push(new Date(start.getTime() + (interval * i)));
    }

    if (!omitFirstTick) {
        ticks.push(end);
    }

    return ticks;
}

/**
 * Obtiene el formato de tick adecuado para el eje basándose en el marco temporal especificado.
 *
 * @param {number} timeframe Marco temporal para determinar el formato de los ticks.
 * @returns {Function} Una función de formato para los ticks del eje X.
 */

export function getTickFormat(timeframe) {

    const spanishLocale = d3.timeFormatLocale({
        "decimal": ",",
        "thousands": ".",
        "grouping": [3],
        "currency": ["$", ""],
        "dateTime": "%A, %e de %B de %Y %X",
        "date": "%d/%m/%Y",
        "time": "%H:%M:%S",
        "periods": ["AM", "PM"],
        "days": ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
        "shortDays": ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
        "months": ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
        "shortMonths": ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
    });


    const formatDayMonth = spanishLocale.format("%d-%b");
    const formatMonthYear = spanishLocale.format("%b-%y");
    const formatYear = spanishLocale.format("%Y");
    const formatWeek = spanishLocale.format("%a-%d");
    const formatDayTime = spanishLocale.format("%H:%M-%d");

    switch (timeframe) {
        case 0:
            return (d) => formatMonthYear(d);
        case 2:
            return (d) => formatDayTime(d);
        case 7:
            return (d) => formatWeek(d);
        case 31:
            return (d) => formatDayMonth(d);
        case 1825:
            return (d) => formatYear(d);
        case 3650:
            return (d) => formatYear(d);
        default:
            return spanishLocale.format("%Y-%m-%d");
    }
}

/**
* Construye y gestiona el tooltip para el gráfico histórico. El tooltip se muestra cuando el usuario pasa el mouse sobre el gráfico, 
* y muestra la fecha y el valor del punto más cercano al cursor.
*
* @param {d3.Selection} group - El grupo SVG en el que se dibujará el tooltip.
* @param {number} xPosition - La posición X inicial del área del gráfico dentro del grupo SVG.
* @param {number} yPosition - La posición Y inicial del área del gráfico dentro del grupo SVG.
* @param {number} width - El ancho del área del gráfico.
* @param {number} adjustedHeight - La altura del área del gráfico, ajustada por cualquier margen o desbordamiento.
* @param {d3.ScaleTime} xScale - La escala de tiempo de D3 utilizada para el eje X del gráfico.
* @param {d3.ScaleLinear} yScale - La escala lineal de D3 utilizada para el eje Y del gráfico.
* @param {Object[]} data - Los datos mostrados en el gráfico, donde cada objeto debe tener una fecha y un valor.
*/
export const buildTooltip = (group, xPosition, yPosition, width, adjustedHeight, xScale, yScale, data) => {
    const tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip-historical')
        .style('position', 'absolute')
        .style('background-color', '#FFFFFF')
        .style('padding', '16px 24px')
        .style('box-shadow', '0 8px 16px 0 rgba(0, 0, 0, 0.12)')
        .style('font-family', 'Montserrat, sans-serif')
        .style('pointer-events', 'none')
        .style('opacity', 0)
        .style('transition', 'opacity 0.2s')
        .style('display', 'none')
        .style('flex-direction', 'column')
        .style('align-items', 'flex-start')
        .style('gap', '5px')
        .style('border-radius', '20px')
        .style('background', 'linear-gradient(100deg, #FBFBFF 6.9%, rgba(255, 255, 255, 0.83) 84.24%)');

    const container = tooltip.append('div')
        .style('display', 'flex')
        .style('flex-direction', 'column')
        .style('align-items', 'flex-start')
        .style('gap', '8px');

    const bottomContainer = container.append('div')
        .style('display', 'flex')
        .style('margin-top', '16px')
        .style('flex-direction', 'row')
        .style('justify-content', 'space-between')
        .style('width', '100%');

    const leftBottomContainer = bottomContainer.append('div')
        .style('display', 'flex')
        .style('margin-right', '16px')
        .style('flex-direction', 'column')
        .style('align-items', 'flex-start');

    leftBottomContainer.append('div')
        .attr('class', 'close-title')
        .text('CLOSE')
        .style('font-size', '10px')
        .style('font-weight', '700')
        .style('line-height', '12px')
        .style('margin-bottom', '4px')
        .style('text-transform', 'uppercase');

    leftBottomContainer.append('div')
        .attr('class', 'close-value')
        .style('font-size', '16px')
        .style('font-family', 'Montserrat')
        .style('font-weight', '400')
        .style('line-height', '24px');

    const rightBottomContainer = bottomContainer.append('div')
        .style('display', 'flex')
        .style('flex-direction', 'column')
        .style('align-items', 'flex-start');

    rightBottomContainer.append('div')
        .attr('class', 'date-title')
        .text('DATE')
        .style('font-size', '10px')
        .style('font-weight', '700')
        .style('line-height', '12px')
        .style('margin-bottom', '4px')
        .style('text-transform', 'uppercase');

    rightBottomContainer.append('div')
        .attr('class', 'date-value')
        .style('font-size', '16px')
        .style('font-family', 'Montserrat')
        .style('font-weight', '400')
        .style('line-height', '24px');

    const bisectDate = d3.bisector(d => d.date).left;

    const outerRing = group.append('circle')
        .attr('r', 4.5)
        .attr('fill', '#fff')
        .attr('stroke-width', 0)
        .attr('fill-opacity', 0.8);

    const focusCircle = group.append('circle')
        .attr('class', 'focus-circle')
        .attr('r', 2.5)
        .attr('fill', '#0C66E4')
        .style('opacity', 0);

    

    group.append('rect')
        .attr('class', 'overlay')
        .attr('x', xPosition)
        .attr('y', yPosition)
        .attr('width', width)
        .attr('height', adjustedHeight)
        .style('fill', 'none')
        .style('pointer-events', 'all')
        .on('mouseover', () => {
            tooltip.style('display', 'flex');
            tooltip.style('opacity', 1);
            focusCircle.style('opacity', 1);
            outerRing.style('opacity', 1);
        })
        .on('mouseout', () => {
            tooltip.style('display', 'none');
            tooltip.style('opacity', 0);
            focusCircle.style('opacity', 0);
            outerRing.style('opacity', 0);
        })
        .on('mousemove', event => {
            try {
                const x0 = xScale.invert(d3.pointer(event, this)[0] - xPosition);
                const i = bisectDate(data, x0, 1);
                const d0 = data[i - 1];
                const d1 = data[i];
                const d = x0 - d0.date > d1.date - x0 ? d1 : d0;

                tooltip.style('left', `${xScale(d.date) + xPosition}px`).style('top', `${yScale(d.close) + yPosition - 80}px`);
                outerRing.attr('cx', xScale(d.date) + xPosition).attr('cy', yScale(d.close) + yPosition).style('opacity', 1);
                focusCircle.attr('cx', xScale(d.date) + xPosition).attr('cy', yScale(d.close) + yPosition).style('opacity', 1);

                leftBottomContainer.select('.close-value').text(`$${abbreviateNumber(d.close)}`);
                rightBottomContainer.select('.date-value').text(d3.timeFormat("%Y-%m-%d")(d.date));
            } catch {
                focusCircle.style('opacity', 0);
                outerRing.style('opacity', 0);
            }
        });
};

export const abbreviateNumber = (value) => {
    let newValue = value;
    const suffixes = ["", "K", "M", "B", "T"];
    let suffixNum = 0;
    while (newValue >= 1000) {
        newValue /= 1000;
        suffixNum++;
    }

    newValue = newValue.toPrecision(3);

    newValue += suffixes[suffixNum];
    return newValue;
};