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
    { date: parseDate("2028-01-01"), value: 60 },
    { date: parseDate("2033-09-31"), value: 30 },
    { date: tenYearsFromNow, value: 40 },
  ];
  const currentData = data.filter(d => d.date < tenYearsFromNow);
  const futureData = data.filter(d => d.date >= tenYearsFromNow);

  const yScale = d3.scaleLinear()
    .domain([0, 100])
    .range([height - margin.bottom, margin.top]);

  const xScale = d3.scaleTime()
    .domain([today, d3.timeDay.offset(tenYearsFromNow, -1)])
    .range([margin.left, width - margin.right]);

  const svg = chartContainer.append("svg")
    .attr("width", width)
    .attr("height", height);

  drawXAxis(svg, xScale);
  drawYAxis(svg, yScale);
  drawCurrentData(svg, currentData, xScale, yScale);
  drawDiscontinuityLine(svg, xScale);
  drawFutureData(svg, futureData, xScale, yScale);

  function drawXAxis(svg, xScale) {
    const xAxis = d3.axisBottom(xScale)
      .ticks(10)
      .tickFormat(d3.timeFormat("%Y"))
      .tickValues(xScale.ticks(10).filter(d => d < tenYearsFromNow));

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(xAxis);
  }

  function drawYAxis(svg, yScale) {
    // Crear un eje Y sin el tick "+3X"
    const yAxis = d3.axisLeft(yScale)
      .tickValues(yScale.ticks().filter(tick => tick !== 100))
      .tickFormat(d => `$${d}B`);

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(yAxis);

    // Añadir la línea de discontinuidad en el valor 100
    const discontinuityLineY = yScale(100);
    svg.append("line")
      .attr("x1", margin.left)
      .attr("x2", width - margin.right)
      .attr("y1", discontinuityLineY)
      .attr("y2", discontinuityLineY)
      .attr("stroke", "#d3d3d3")
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "5,5");
  }

  function drawCurrentData(svg, currentData, xScale, yScale) {
    svg.selectAll("circle.current")
      .data(currentData)
      .enter()
      .append("circle")
      .attr("cx", d => xScale(d.date))
      .attr("cy", d => yScale(d.value))
      .attr("r", 5)
      .attr("fill", "blue");
  }

  function drawDiscontinuityLine(svg, xScale) {
    const endOfCurrentAxis = xScale(d3.timeDay.offset(tenYearsFromNow, -1));
    svg.append("line")
      .attr("x1", endOfCurrentAxis)
      .attr("y1", margin.top)
      .attr("x2", endOfCurrentAxis)
      .attr("y2", height - margin.bottom)
      .attr("stroke", "#d3d3d3")
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "5,5");
  }

  function drawFutureData(svg, futureData, xScale, yScale) {
    const futureWidth = 50;
    const xScaleFuture = d3.scaleTime()
      .domain([tenYearsFromNow, d3.max(futureData, d => d.date)])
      .range([0, futureWidth]);

    const xAxisFuture = d3.axisBottom(xScaleFuture)
      .ticks(1)
      .tickFormat(() => "+10YRS")
      .tickSizeOuter(0);

    const startOfFutureAxis = width - margin.right;

    svg.append("g")
      .attr("transform", `translate(${startOfFutureAxis}, ${height - margin.bottom})`)
      .call(xAxisFuture);

    svg.selectAll("circle.future")
      .data(futureData)
      .enter()
      .append("circle")
      .attr("class", "future")
      .attr("cx", d => startOfFutureAxis + xScaleFuture(d.date))
      .attr("cy", d => yScale(d.value))
      .attr("r", 5)
      .attr("fill", "red");
  }
}

// Llamada a la función para inicializar el gráfico
initializeChart("#chart-container");
