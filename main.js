function initializeChart(containerSelector) {
  const chartContainer = d3.select(containerSelector);
  const width = 800;
  const height = 400;
  const margin = { top: 40, right: 200, bottom: 40, left: 40 };
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
  const mixedData = data.filter(d => d.date >= tenYearsFromNow && d.value > 90);
  const extendedData = data.filter(d => d.value > 90 && d.date < tenYearsFromNow);
  const futureData = data.filter(d => d.date >= tenYearsFromNow && d.value <= 90);

  drawMainDomain(svg, xScale, yScale, currentData);
  drawDiscontinuityLine(svg, xScale, yScale);
  drawFutureDomain(svg, futureData, yScale);
  drawExtendedDomain(svg, extendedData, xScale);
  drawMixedFutureExtendedDomain(svg, mixedData, xScale, yScale);

  // Se encarga de dibujar el gráfico principal, el cual cuenta con su propio dominio y escala para el eje X y Y.
  function drawMainDomain(svg, xScale, yScale, currentData) {
    drawXAxis(svg, xScale);
    drawYAxis(svg, yScale);
    drawCurrentData(svg, currentData, xScale, yScale);
  }

  // Se encarga de dibujar el eje X, el de abajo, el cual cuenta con 10 ticks y su formato es de años.
  function drawXAxis(svg, xScale) {
    const xAxis = d3.axisBottom(xScale)
      .ticks(10)
      .tickFormat(d3.timeFormat("%Y"))
      .tickValues(xScale.ticks(10).filter(d => d < tenYearsFromNow));

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(xAxis);
  }

  // Se encarga de dibujar el eje Y, el de la izquierda, el cual cuenta con 10 ticks (contabilizando el 0) y su formato es de billones.
  function drawYAxis(svg, yScale) {
    const yAxis = d3.axisLeft(yScale)
      .tickValues(yScale.ticks().filter(tick => tick < 100))
      .tickFormat(d => `$${d}B`);
    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(yAxis);
  }

  // Se encarga de dibujar los puntos azules, el cual representa el presente de la gráfica.
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

  // Se encarga de dibujar la línea discontinua que separa el gráfico principal del futuro y la extensión.
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

  // Se encarga de dibujar el segundo eje X, el de la derecha, y los puntos rojos, el cual representa el futuro de la gráfica.
  // Este cuenta con su propio dominio y escala para el eje X y ocupa el mismo eje Y que el gráfico principal.
  // El eje X cuenta con 1 tick, el cual reprsentará el valor de todos los datos que se encuentren en el futuro.
  function drawFutureDomain(svg, futureData, yScale) {
    // Definir el ancho de la extensión del eje X
    const futureWidth = 50;
    const middleOfFutureArea = futureWidth / 2;

    // Crear un dominio con tres valores y hacer que el rango cubra el ancho extendido
    const xScaleFuture = d3.scaleLinear() // Cambiando a scaleLinear por simplicidad
      .domain([0, 1, 2]) // Utilizamos tres valores para posicionar el tick en el centro
      .range([0, middleOfFutureArea, futureWidth]);

    // Crear el eje X futuro con tres ticks, pero mostraremos solo el del centro
    const xAxisFuture = d3.axisBottom(xScaleFuture)
      .tickValues([1]) // Solo queremos mostrar el tick para el valor '1'
      .tickFormat(d => d === 1 ? '+10YRS' : '') // Asignar el formato '+10YRS' solo al tick del centro
      .tickSizeOuter(0);

    // Añadir el eje X futuro al SVG
    const startOfFutureAxis = width - margin.right + middleOfFutureArea; // Ajustar la posición de inicio del eje

    svg.append("g")
      .attr("transform", `translate(${startOfFutureAxis - middleOfFutureArea}, ${height - margin.bottom})`)
      .call(xAxisFuture);

    // Dibujar los puntos futuros, alineados con el tick central
    svg.selectAll("circle.future")
      .data(futureData)
      .enter()
      .append("circle")
      .attr("class", "future")
      .attr("cx", startOfFutureAxis) // Todos los puntos se alinean con el tick '+10YRS'
      .attr("cy", d => yScale(d.value))
      .attr("r", 5)
      .attr("fill", "red");
  }

  // Se encarga de dibujar el tercer eje Y, el de arriba, y los puntos verdes, el cual representa la extensión de la gráfica.
  // Este cuenta con su propio dominio y escala para el eje Y y ocupa el mismo eje X que el gráfico principal.
  // El eje Y cuenta con 1 tick, el cual reprsentará el valor de todos los datos que se encuentren en la extensión el cual es mayor a 90 y su tick es +3X.
  function drawExtendedDomain(svg, extendedData, xScale) {
    // Definir la altura de la extensión del eje Y
    const extendedHeight = 50;
    const middleOfExtendedArea = yScale(90) - extendedHeight / 2;

    // Crear un dominio con tres valores y hacer que el rango cubra la altura extendida
    const yScaleExtended = d3.scaleLinear()
      .domain([0, 1, 2]) // Utilizamos tres valores para posicionar el tick en el centro
      .range([yScale(90), middleOfExtendedArea, yScale(90) - extendedHeight]);

    // Crear el eje Y extendido con tres ticks, pero mostraremos solo el del centro
    const yAxisExtended = d3.axisLeft(yScaleExtended)
      .tickValues([1]) // Solo queremos mostrar el tick para el valor '1'
      .tickFormat(d => d === 1 ? '+3X' : '') // Asignar el formato '+3X' solo al tick del centro
      .tickSizeOuter(0);

    // Añadir el eje Y extendido al SVG
    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(yAxisExtended);

    // Dibujar los puntos extendidos, alineados con el tick central
    svg.selectAll("circle.extended")
      .data(extendedData)
      .enter()
      .append("circle")
      .attr("class", "extended")
      .attr("cx", d => xScale(d.date))
      .attr("cy", middleOfExtendedArea) // Todos los puntos se alinean con el tick '+3X'
      .attr("r", 5)
      .attr("fill", "green");
  }

  // Se encarga de dibujar el punto morado, el cual representa la intersección entre el futuro y la extensión.
  // Este cuenta con su propio dominio y escala para el eje X y Y y ocupa el mismo eje X y Y que el gráfico principal.
  // El eje X y Y cuenta con 1 tick, el cual reprsentará el valor de todos los datos que se encuentren en la intersección.
  function drawMixedFutureExtendedDomain(svg, mixedData, xScale, yScale) {
    // Definir el punto de intersección para el eje X y el eje Y en el espacio mixto
    const futureXIntersection = width - margin.right + (50 / 2); // Mitad del espacio asignado a la extensión futura
    const extendedYIntersection = yScale(90) - (50 / 2); // Mitad del espacio asignado a la extensión Y

    // Escalas de dominio de tres valores para la intersección
    const xScaleMixed = d3.scaleLinear()
      .domain([0, 1, 2]) // Solo se utiliza el valor 1 para posicionar en el centro
      .range([futureXIntersection - 25, futureXIntersection, futureXIntersection + 25]);

    const yScaleMixed = d3.scaleLinear()
      .domain([0, 1, 2]) // Solo se utiliza el valor 1 para posicionar en el centro
      .range([extendedYIntersection + 25, extendedYIntersection, extendedYIntersection - 25]);

    // Dibujar el punto mixto en la intersección de las extensiones
    svg.selectAll("circle.mixed")
      .data(mixedData)
      .enter()
      .append("circle")
      .attr("class", "mixed")
      .attr("cx", xScaleMixed(1)) // Colocar en la mitad del eje X mixto
      .attr("cy", yScaleMixed(1)) // Colocar en la mitad del eje Y mixto
      .attr("r", 5)
      .attr("fill", "purple"); // Usar un color distinto para diferenciar
  }
}

initializeChart("#chart-container");