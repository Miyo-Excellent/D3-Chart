/**
 * Se encarga de construir el gráfico de proyección.
 * @param containerSelector: Selector del contenedor donde se dibujará el gráfico.
 * @param width: Ancho del gráfico.
 * @param height: Alto del gráfico.
 * @param margin: Margen del gráfico.
 * @param extended: Indica si se debe dibujar el gráfico extendido.
 * @returns {Promise<void>}
 */
const buildProjectionChart = (containerSelector, width, height, margin) => {
    const chartContainer = d3.select(containerSelector);

    const parseDate = d3.timeParse("%Y-%m-%d");
    const today = new Date();
    const tenYearsFromNow = new Date(today.getFullYear() + 10, today.getMonth(), today.getDate());

    const data = [
        { date: today, value: 10 },
        { date: parseDate("2025-01-01"), value: 50 },
        { date: parseDate("2026-01-01"), value: 20 },
        { date: parseDate("2028-01-01"), value: 90 },
        { date: parseDate("2025-01-01"), value: 130 },
        { date: parseDate("2029-01-01"), value: 150 },
        { date: parseDate("2033-09-31"), value: 30 },
        { date: parseDate("2034-01-01"), value: 300 },
        { date: tenYearsFromNow, value: 40 },
    ];

    const yScale = d3.scaleLinear()
        .domain([0, 90])
        .range([height - margin.bottom, margin.top]);

    const xScale = d3.scaleTime()
        .domain([today, d3.timeDay.offset(tenYearsFromNow, -1)])
        .range([margin.left, width - margin.right]);

    const svg = chartContainer.append("svg")
        .attr("width", width)
        .attr("height", height);

    const currentData = data.filter(d => d.value <= 90);


    drawMainDomain(svg, xScale, yScale, currentData);

    // if (extended === true) {
    const futureData = data.filter(d => d.date >= tenYearsFromNow && d.value <= 90);
    const extendedData = data.filter(d => d.value > 90 && d.date < tenYearsFromNow);
    const mixedData = data.filter(d => d.date >= tenYearsFromNow && d.value > 90);

    drawDiscontinuityLine(svg, xScale, yScale);
    drawFutureDomain(svg, futureData, yScale);
    drawExtendedDomain(svg, extendedData, xScale);
    drawMixedFutureExtendedDomain(svg, mixedData, yScale);
    // }

    // Main Domain: Gráfico principal - Inicio

    /** 
    * Se encarga de dibujar el gráfico principal, el cual cuenta con su propio dominio y escala para el eje X y Y.
    * @param svg: SVG donde se dibujará el gráfico.
    * @param xScale: Escala para el eje X.
    * @param yScale: Escala para el eje Y.
    * @param currentData: Datos que alimentarán el gráfico principal.
    */
    function drawMainDomain(svg, xScale, yScale, currentData) {
        drawXAxis(svg, xScale);
        drawYAxis(svg, yScale);
        drawCurrentData(svg, currentData, xScale, yScale);
    }

    /**
     * Se encarga de dibujar el eje X, del gráfico principal, el cual cuenta con 10 ticks, su formato es de años y su valor máximo es de 10 años a partir de la fecha actual.
     * @param svg: SVG donde se dibujará el eje X.
     * @param xScale: Escala para el eje X.
     */
    function drawXAxis(svg, xScale) {
        const xAxis = d3.axisBottom(xScale)
            .ticks(10)
            .tickFormat(d3.timeFormat("%Y"))
            .tickValues(xScale.ticks(10).filter(d => d < tenYearsFromNow));

        svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(xAxis);
    }

    /**
     * Se encarga de dibujar el eje Y, del gráfico principal, el cual cuenta con 10 ticks, su formato es de billones y su valor máximo es de 90 billones.
     * @param svg: SVG donde se dibujará el eje Y.
     * @param yScale: Escala para el eje Y.
     */
    function drawYAxis(svg, yScale) {
        const yAxis = d3.axisLeft(yScale)
            .tickValues(yScale.ticks().filter(tick => tick < 100))
            .tickFormat(d => `$${d}B`);
        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(yAxis);
    }

    /**
     * Se encarga de dibujar los puntos azules, del gráfico principal, los cuales representan los datos actuales.
     * @param svg: SVG donde se dibujarán los puntos.
     * @param currentData: Datos que alimentarán los puntos.
     * @param xScale: Escala para el eje X.
     * @param yScale: Escala para el eje Y.
     */
    function drawCurrentData(svg, currentData, xScale, yScale) {
        svg.selectAll("circle.current")
            .data(currentData)
            .enter()
            .append("circle")
            .attr("class", "current")
            .attr("cx", d => xScale(d.date))
            .attr("cy", d => yScale(d.value))
            .attr("r", 5)
            .attr("fill", "blue");
    }

    // Main Domain: Gráfico principal - Fin


    // Future Domain: Gráfico futuro - Inicio

    /**
     * Se encarga de dibujar la línea discontinua, la cual representa el límite entre el gráfico principal y el futuro.
     * @param svg: SVG donde se dibujará la línea.
     * @param xScale: Escala para el eje X.
     * @param yScale: Escala para el eje Y.
     */
    function drawDiscontinuityLine(svg, xScale, yScale) {
        const endOfCurrentXAxis = xScale(d3.timeDay.offset(tenYearsFromNow, -1));
        svg.append("line")
            .attr("x1", endOfCurrentXAxis)
            .attr("y1", margin.top)
            .attr("x2", endOfCurrentXAxis)
            .attr("y2", height - margin.bottom)
            .attr("stroke", "#d3d3d3")
            .attr("stroke-width", 2)
            .attr("stroke-dasharray", "5,5");

        const startOfExtendedYAxis = yScale(90);
        svg.append("line")
            .attr("x1", margin.left)
            .attr("x2", width - margin.right)
            .attr("y1", startOfExtendedYAxis)
            .attr("y2", startOfExtendedYAxis)
            .attr("stroke", "#d3d3d3")
            .attr("stroke-width", 2)
            .attr("stroke-dasharray", "5,5");
    }

    /**
     * Se encarga el dominio futuro, el cual cuenta con su propio dominio y escala para el eje X y ocupa el mismo eje Y que el gráfico principal.
     * @param svg: SVG donde se dibujará el dominio futuro.
     * @param futureData: Datos que alimentarán el dominio futuro.
     * @param yScale: Escala para el eje Y.
     */
    function drawFutureDomain(svg, futureData, yScale) {
        const futureWidth = 50;
        const middleOfFutureArea = futureWidth / 2;

        const xScaleFuture = d3.scaleLinear()
            .domain([0, 1, 2])
            .range([0, middleOfFutureArea, futureWidth]);

        const xAxisFuture = d3.axisBottom(xScaleFuture)
            .tickValues([1])
            .tickFormat(d => d === 1 ? '+10YRS' : '')
            .tickSizeOuter(0);

        const startOfFutureAxis = width - margin.right + middleOfFutureArea;

        svg.append("g")
            .attr("transform", `translate(${startOfFutureAxis - middleOfFutureArea}, ${height - margin.bottom})`)
            .call(xAxisFuture);

        svg.selectAll("circle.future")
            .data(futureData)
            .enter()
            .append("circle")
            .attr("class", "future")
            .attr("cx", startOfFutureAxis)
            .attr("cy", d => yScale(d.value))
            .attr("r", 5)
            .attr("fill", "red");
    }

    // Future Domain: Gráfico futuro - Fin

    // Extended Domain: Gráfico extendido - Inicio

    /**
     * Se encarga de dibujar el dominio extendido, el cual cuenta con su propio dominio y escala para el eje Y y ocupa el mismo eje X que el gráfico principal.
     * @param svg: SVG donde se dibujará el dominio extendido.
     * @param extendedData: Datos que alimentarán el dominio extendido.
     * @param xScale: Escala para el eje X.
     */
    function drawExtendedDomain(svg, extendedData, xScale) {
        const extendedHeight = 50;
        const middleOfExtendedArea = yScale(90) - extendedHeight / 2;

        const yScaleExtended = d3.scaleLinear()
            .domain([0, 1, 2])
            .range([yScale(90), middleOfExtendedArea, yScale(90) - extendedHeight]);

        const yAxisExtended = d3.axisLeft(yScaleExtended)
            .tickValues([1])
            .tickFormat(d => d === 1 ? '+3X' : '')
            .tickSizeOuter(0);

        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(yAxisExtended);

        svg.selectAll("circle.extended")
            .data(extendedData)
            .enter()
            .append("circle")
            .attr("class", "extended")
            .attr("cx", d => xScale(d.date))
            .attr("cy", middleOfExtendedArea)
            .attr("r", 5)
            .attr("fill", "green");
    }

    // Extended Domain: Gráfico extendido - Fin


    // Mixed Future Extended Domain: Gráfico mixto - Inicio

    /**
     * Se encarga de dibujar el dominio mixto, el cual cuenta con su propio dominio y escala para el eje X y Y.
     * @param svg: SVG donde se dibujará el dominio mixto.
     * @param mixedData: Datos que alimentarán el dominio mixto.
     * @param yScale: Escala para el eje Y.
     */

    function drawMixedFutureExtendedDomain(svg, mixedData, yScale) {
        const futureXIntersection = width - margin.right + (50 / 2);
        const extendedYIntersection = yScale(90) - (50 / 2);

        const xScaleMixed = d3.scaleLinear()
            .domain([0, 1, 2])
            .range([futureXIntersection - 25, futureXIntersection, futureXIntersection + 25]);

        const yScaleMixed = d3.scaleLinear()
            .domain([0, 1, 2])
            .range([extendedYIntersection + 25, extendedYIntersection, extendedYIntersection - 25]);

        svg.selectAll("circle.mixed")
            .data(mixedData)
            .enter()
            .append("circle")
            .attr("class", "mixed")
            .attr("cx", xScaleMixed(1))
            .attr("cy", yScaleMixed(1))
            .attr("r", 5)
            .attr("fill", "purple");
    }

    // Mixed Future Extended Domain: Gráfico mixto - Fin
}