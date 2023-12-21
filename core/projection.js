import { createRect, valueInThousands, tickValues } from '../helpers/helper.js';
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

export const buildProjectionChart = (group, width, height, xPosition, yPosition, only, data, lastData, highestValue) => {
    createRect(group, xPosition, yPosition, width, height, '#FFFFFF');
    drawOuterLines(group, xPosition, yPosition, height, width);
    
    const today = new Date();
    const generateProjections = generateDummyProjectionsData(today, '2033-01-01', lastData.close);
    const projectionData = generateProjections.map(p => ({
      startDate: new Date(p.start_date),
      endDate: new Date(p.end_date),
      minValue: p.min_value,
      maxValue: p.max_value
    }));

    const xDomain = [today, d3.utcYear.offset(today, 10)];
    const yDomain = [0, highestValue];

    const xScale = d3.scaleUtc().domain(xDomain).range([0, width]);
    const yScale = d3.scaleLinear().domain(yDomain).range([height, 0]);

    const ticks = tickValues(highestValue, 9, 10);

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
            .attr('stroke', '#ECECEC')
            .attr('x2', -width));

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
            .attr('x2', width));
    }else{
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
           .attr("y2", yPosition + height)
           .attr("stroke", "url(#splitPattern)")
           .attr("stroke-width", 2);
    }

    return;
};

const drawOuterLines = (group, xPosition, yPosition, height, width) => {
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

    const verticalLine = group.append('line')
        .attr('x1', xPosition + width + 10)
        .attr('y1', yPosition + height)
        .attr('x2', xPosition + width + 10)
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
            .attr('x1', xPosition + width + 10 + offsetX / 2)
            .attr('y1', yPosition + 6 + offsetY / 2) 
            .attr('x2', xPosition + width + 10 + offsetX / 2) // Punto inicial igual a x1
            .attr('y2', yPosition + 6 + offsetY / 2) // Punto inicial igual a y1
            .attr('stroke', '#BDC2C7')
            .attr('stroke-width', 1.5);
    
        // Anima la línea hasta alcanzar la longitud y orientación deseadas
        inclinedLine.transition()
            .duration(500)
            .attr('x2', xPosition + width + 5) // Punto final en X
            .attr('y2', yPosition + 3 - offsetY / 2); // Punto final en Y
    }
            
    };







    // const parseDate = d3.timeParse("%Y-%m-%d");
    // const today = new Date();
    // const tenYearsFromNow = new Date(today.getFullYear() + 10, today.getMonth(), today.getDate());

    // const data = [
    //     { date: today, value: 10 },
    //     { date: parseDate("2025-01-01"), value: 50 },
    //     { date: parseDate("2026-01-01"), value: 20 },
    //     { date: parseDate("2028-01-01"), value: 90 },
    //     { date: parseDate("2025-01-01"), value: 130 },
    //     { date: parseDate("2029-01-01"), value: 150 },
    //     { date: parseDate("2033-09-31"), value: 30 },
    //     { date: parseDate("2034-01-01"), value: 300 },
    //     { date: tenYearsFromNow, value: 40 },
    // ];

    // const yScale = d3.scaleLinear()
    //     .domain([0, 90])
    //     .range([height - margin.bottom, margin.top]);

    // const xScale = d3.scaleTime()
    //     .domain([today, d3.timeDay.offset(tenYearsFromNow, -1)])
    //     .range([margin.left, width - margin.right]);

    // const svg = chartContainer.append("svg")
    //     .attr("width", width)
    //     .attr("height", height);

    // const currentData = data.filter(d => d.value <= 90);


    // drawMainDomain(svg, xScale, yScale, currentData);

    // if (extended === true) {
    // const futureData = data.filter(d => d.date >= tenYearsFromNow && d.value <= 90);
    // const extendedData = data.filter(d => d.value > 90 && d.date < tenYearsFromNow);
    // const mixedData = data.filter(d => d.date >= tenYearsFromNow && d.value > 90);

    // drawDiscontinuityLine(svg, xScale, yScale);
    // drawFutureDomain(svg, futureData, yScale);
    // drawExtendedDomain(svg, extendedData, xScale);
    // drawMixedFutureExtendedDomain(svg, mixedData, yScale);
    // }

    // Main Domain: Gráfico principal - Inicio

    /** 
    * Se encarga de dibujar el gráfico principal, el cual cuenta con su propio dominio y escala para el eje X y Y.
    * @param svg: SVG donde se dibujará el gráfico.
    * @param xScale: Escala para el eje X.
    * @param yScale: Escala para el eje Y.
    * @param currentData: Datos que alimentarán el gráfico principal.
    */
    // function drawMainDomain(svg, xScale, yScale, currentData) {
    //     drawXAxis(svg, xScale);
    //     drawYAxis(svg, yScale);
    //     drawCurrentData(svg, currentData, xScale, yScale);
    // }

    /**
     * Se encarga de dibujar el eje X, del gráfico principal, el cual cuenta con 10 ticks, su formato es de años y su valor máximo es de 10 años a partir de la fecha actual.
     * @param svg: SVG donde se dibujará el eje X.
     * @param xScale: Escala para el eje X.
     */
    // function drawXAxis(svg, xScale) {
    //     const xAxis = d3.axisBottom(xScale)
    //         .ticks(10)
    //         .tickFormat(d3.timeFormat("%Y"))
    //         .tickValues(xScale.ticks(10).filter(d => d < tenYearsFromNow));

    //     svg.append("g")
    //         .attr("transform", `translate(0,${height - margin.bottom})`)
    //         .call(xAxis);
    // }

    /**
     * Se encarga de dibujar el eje Y, del gráfico principal, el cual cuenta con 10 ticks, su formato es de billones y su valor máximo es de 90 billones.
     * @param svg: SVG donde se dibujará el eje Y.
     * @param yScale: Escala para el eje Y.
     */
    // function drawYAxis(svg, yScale) {
    //     const yAxis = d3.axisLeft(yScale)
    //         .tickValues(yScale.ticks().filter(tick => tick < 100))
    //         .tickFormat(d => `$${d}B`);
    //     svg.append("g")
    //         .attr("transform", `translate(${margin.left},0)`)
    //         .call(yAxis);
    // }

    /**
     * Se encarga de dibujar los puntos azules, del gráfico principal, los cuales representan los datos actuales.
     * @param svg: SVG donde se dibujarán los puntos.
     * @param currentData: Datos que alimentarán los puntos.
     * @param xScale: Escala para el eje X.
     * @param yScale: Escala para el eje Y.
     */
    // function drawCurrentData(svg, currentData, xScale, yScale) {
    //     svg.selectAll("circle.current")
    //         .data(currentData)
    //         .enter()
    //         .append("circle")
    //         .attr("class", "current")
    //         .attr("cx", d => xScale(d.date))
    //         .attr("cy", d => yScale(d.value))
    //         .attr("r", 5)
    //         .attr("fill", "blue");
    // }

    // Main Domain: Gráfico principal - Fin


    // Future Domain: Gráfico futuro - Inicio

    /**
     * Se encarga de dibujar la línea discontinua, la cual representa el límite entre el gráfico principal y el futuro.
     * @param svg: SVG donde se dibujará la línea.
     * @param xScale: Escala para el eje X.
     * @param yScale: Escala para el eje Y.
     */
    // function drawDiscontinuityLine(svg, xScale, yScale) {
    //     const endOfCurrentXAxis = xScale(d3.timeDay.offset(tenYearsFromNow, -1));
    //     svg.append("line")
    //         .attr("x1", endOfCurrentXAxis)
    //         .attr("y1", margin.top)
    //         .attr("x2", endOfCurrentXAxis)
    //         .attr("y2", height - margin.bottom)
    //         .attr("stroke", "#d3d3d3")
    //         .attr("stroke-width", 2)
    //         .attr("stroke-dasharray", "5,5");

    //     const startOfExtendedYAxis = yScale(90);
    //     svg.append("line")
    //         .attr("x1", margin.left)
    //         .attr("x2", width - margin.right)
    //         .attr("y1", startOfExtendedYAxis)
    //         .attr("y2", startOfExtendedYAxis)
    //         .attr("stroke", "#d3d3d3")
    //         .attr("stroke-width", 2)
    //         .attr("stroke-dasharray", "5,5");
    // }

    /**
     * Se encarga el dominio futuro, el cual cuenta con su propio dominio y escala para el eje X y ocupa el mismo eje Y que el gráfico principal.
     * @param svg: SVG donde se dibujará el dominio futuro.
     * @param futureData: Datos que alimentarán el dominio futuro.
     * @param yScale: Escala para el eje Y.
     */
    // function drawFutureDomain(svg, futureData, yScale) {
    //     const futureWidth = 50;
    //     const middleOfFutureArea = futureWidth / 2;

    //     const xScaleFuture = d3.scaleLinear()
    //         .domain([0, 1, 2])
    //         .range([0, middleOfFutureArea, futureWidth]);

    //     const xAxisFuture = d3.axisBottom(xScaleFuture)
    //         .tickValues([1])
    //         .tickFormat(d => d === 1 ? '+10YRS' : '')
    //         .tickSizeOuter(0);

    //     const startOfFutureAxis = width - margin.right + middleOfFutureArea;

    //     svg.append("g")
    //         .attr("transform", `translate(${startOfFutureAxis - middleOfFutureArea}, ${height - margin.bottom})`)
    //         .call(xAxisFuture);

    //     svg.selectAll("circle.future")
    //         .data(futureData)
    //         .enter()
    //         .append("circle")
    //         .attr("class", "future")
    //         .attr("cx", startOfFutureAxis)
    //         .attr("cy", d => yScale(d.value))
    //         .attr("r", 5)
    //         .attr("fill", "red");
    // }

    // Future Domain: Gráfico futuro - Fin

    // Extended Domain: Gráfico extendido - Inicio

    /**
     * Se encarga de dibujar el dominio extendido, el cual cuenta con su propio dominio y escala para el eje Y y ocupa el mismo eje X que el gráfico principal.
     * @param svg: SVG donde se dibujará el dominio extendido.
     * @param extendedData: Datos que alimentarán el dominio extendido.
     * @param xScale: Escala para el eje X.
     */
    // function drawExtendedDomain(svg, extendedData, xScale) {
    //     const extendedHeight = 50;
    //     const middleOfExtendedArea = yScale(90) - extendedHeight / 2;

    //     const yScaleExtended = d3.scaleLinear()
    //         .domain([0, 1, 2])
    //         .range([yScale(90), middleOfExtendedArea, yScale(90) - extendedHeight]);

    //     const yAxisExtended = d3.axisLeft(yScaleExtended)
    //         .tickValues([1])
    //         .tickFormat(d => d === 1 ? '+3X' : '')
    //         .tickSizeOuter(0);

    //     svg.append("g")
    //         .attr("transform", `translate(${margin.left},0)`)
    //         .call(yAxisExtended);

    //     svg.selectAll("circle.extended")
    //         .data(extendedData)
    //         .enter()
    //         .append("circle")
    //         .attr("class", "extended")
    //         .attr("cx", d => xScale(d.date))
    //         .attr("cy", middleOfExtendedArea)
    //         .attr("r", 5)
    //         .attr("fill", "green");
    // }

    // Extended Domain: Gráfico extendido - Fin


    // Mixed Future Extended Domain: Gráfico mixto - Inicio

    /**
     * Se encarga de dibujar el dominio mixto, el cual cuenta con su propio dominio y escala para el eje X y Y.
     * @param svg: SVG donde se dibujará el dominio mixto.
     * @param mixedData: Datos que alimentarán el dominio mixto.
     * @param yScale: Escala para el eje Y.
     */

    // function drawMixedFutureExtendedDomain(svg, mixedData, yScale) {
    //     const futureXIntersection = width - margin.right + (50 / 2);
    //     const extendedYIntersection = yScale(90) - (50 / 2);

    //     const xScaleMixed = d3.scaleLinear()
    //         .domain([0, 1, 2])
    //         .range([futureXIntersection - 25, futureXIntersection, futureXIntersection + 25]);

    //     const yScaleMixed = d3.scaleLinear()
    //         .domain([0, 1, 2])
    //         .range([extendedYIntersection + 25, extendedYIntersection, extendedYIntersection - 25]);

    //     svg.selectAll("circle.mixed")
    //         .data(mixedData)
    //         .enter()
    //         .append("circle")
    //         .attr("class", "mixed")
    //         .attr("cx", xScaleMixed(1))
    //         .attr("cy", yScaleMixed(1))
    //         .attr("r", 5)
    //         .attr("fill", "purple");
    // }

    // Mixed Future Extended Domain: Gráfico mixto - Fin
// }