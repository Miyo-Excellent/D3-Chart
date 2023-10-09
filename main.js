import { getMarketData } from './apis/coinGekko/index.js';

async function drawChart() {
  const { dates, prices } = await getMarketData(365 * 10);

  const data = dates.map((date, index) => ({
    date: new Date(date),
    close: prices[index]
  }));

  const lastDatum = data[data.length - 1];
  const outerRingRadius = 9;
  const innerCircleRadius = 4.5;

  const width = 1450;
  const height = 540;
  const margin = { top: 20, right: 50, bottom: 50, left: 70 };

  const svg = d3.select('#marketChart').append('svg')
    .attr('width', width)
    .attr('height', height);

  const xHistorical = d3.scaleUtc()
    .domain(d3.extent(data, d => d.date))
    .range([margin.left, width / 2]);

  const yHistorical = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.close)])
    .range([height - margin.bottom, margin.top])
    .nice();

  // Líneas horizontales para ambos gráficos
  const yAxisGrid = svg.append('g')
    .attr('transform', `translate(${margin.left},0)`);
  yAxisGrid
    .call(d3.axisLeft(yHistorical).tickSize(-(width - margin.left - margin.right)).tickFormat(''))
    .selectAll('.tick line')
    .attr('stroke', '#3A4B59');

  yAxisGrid.select(".domain").remove();
  yAxisGrid.lower();

  const lineHistorical = d3.line()
    .x(d => xHistorical(d.date))
    .y(d => yHistorical(d.close));

  svg.append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', '#17A2B8')
    .attr('stroke-width', 1.5)
    .attr('d', lineHistorical);

  svg.append('rect')
    .attr('x', margin.left)
    .attr('y', margin.top)
    .attr('width', width / 2 - margin.left)
    .attr('height', height - margin.top - margin.bottom)
    .attr('fill', '#293C4B')
    // .attr('rx', 10)
    .lower();

  // Patron linea divisioria
  const defs = svg.append("defs");

  const pattern = defs.append("pattern")
    .attr("id", "splitPattern")
    .attr("width", "10")
    .attr("height", "10")
    .attr("patternUnits", "userSpaceOnUse");

  pattern.append("rect")
    .attr("width", "10")
    .attr("height", "5")
    .attr("transform", "translate(0,0)")
    .attr("fill", "#293C4B");  // color del fondo del gráfico izquierdo

  pattern.append("rect")
    .attr("width", "10")
    .attr("height", "5")
    .attr("transform", "translate(0,5)")
    .attr("fill", "white");  // color del fondo del gráfico derecho


  // Configuración del gráfico de proyecciones (derecho)
  svg.append("line")
    .attr("x1", width / 2)
    .attr("y1", margin.top)
    .attr("x2", width / 2)
    .attr("y2", height - margin.bottom)
    .attr("stroke", "url(#splitPattern)")
    .attr("stroke-width", "2");

  const projectionData = []; // Sin datos por el momento

  const today = new Date();

  const xProjection = d3.scaleUtc()
    .domain([today, d3.utcYear.offset(today, 10)]) // Asume 10 años de proyecciones
    .range([width / 2, width - margin.right]);

  const lineProjection = d3.line()
    .x(d => xProjection(d.date))
    .y(d => yHistorical(d.close));

  svg.append('path')
    .datum(projectionData)
    .attr('fill', 'none')
    .attr('stroke', '#17A2B8')
    .attr('stroke-width', 1.5)
    .attr('d', lineProjection);

  svg.append('rect')
    .attr('x', width / 2)
    .attr('y', margin.top)
    .attr('width', width / 2 - margin.right)
    .attr('height', height - margin.top - margin.bottom)
    .attr('fill', 'white');

  // Ejes X para ambos gráficos
  const xAxisHistorical = svg.append('g')
    .attr('transform', `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(xHistorical).tickSize(0))
    .attr('stroke-opacity', 0)
    .selectAll("text")
    .attr("dy", "1.5em");

  xAxisHistorical.select(".domain").remove();


  const xAxisProjection = svg.append('g')
    .attr('transform', `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(xProjection).tickSize(0))
    .attr('stroke-opacity', 0)
    .selectAll("text")
    .attr("dy", "1.5em");

  xAxisProjection.select(".domain").remove();

  const formatYAxis = d => `$${d3.format(".2s")(d)}`;

  const yAxisLeft = svg.append('g')
    .attr('transform', `translate(${margin.left},0)`)
    .call(d3.axisLeft(yHistorical).tickSize(0).tickFormat(formatYAxis).ticks(10));

  yAxisLeft.select(".domain").remove();

  yAxisLeft.selectAll("text")
    .attr("dx", "-0.8em");

  const yAxisRight = svg.append('g')
    .attr('transform', `translate(${width - margin.right},0)`)
    .call(d3.axisRight(yHistorical).tickSize(-(width - width / 2 - margin.right)).tickFormat(formatYAxis).ticks(10));

  yAxisRight.selectAll("text")
    .attr("dx", "0.8em");

  yAxisRight.selectAll('.tick line')
    .attr('stroke', '#ECECEC');

  yAxisRight.select(".domain").remove();

  // Estilo de los labels de los ejes
  svg.selectAll("g > text")
    .style("font-family", "Montserrat")
    .style("font-size", "12px")
    .style("font-weight", "500")
    .style("line-height", "15px")
    .style("letter-spacing", "0.4285714030265808px")
    .style("text-align", "center")
    .style("color", "#D6D9DC");

  // Gradients
  const gradient = svg.append("defs")
    .append("linearGradient")
    .attr("id", "areaGradient")
    .attr("gradientUnits", "userSpaceOnUse")
    .attr("x1", 0).attr("y1", yHistorical(0))
    .attr("x2", 0).attr("y2", yHistorical(d3.max(data, d => d.close)))
    .selectAll("stop")
    .data([
      { offset: "0%", color: "rgba(30, 41, 52, 0.70)" },
      { offset: "53.57%", color: "rgba(9, 39, 56, 0.08)" },
      { offset: "100%", color: "rgba(0, 0, 0, 0.00)" }
    ])
    .enter().append("stop")
    .attr("offset", d => d.offset)
    .attr("stop-color", d => d.color);

  const areaHistorical = d3.area()
    .x(d => xHistorical(d.date))
    .y0(yHistorical(0))
    .y1(d => yHistorical(d.close));

  // Esta parte del código aplica el gradiente al área bajo la línea
  svg.append('path')
    .datum(data)
    .attr('fill', 'url(#areaGradient)') // Usa el gradiente como relleno
    .attr('d', areaHistorical);


  // Anillo exterior
  svg.append('circle')
    .attr('cx', xHistorical(lastDatum.date))
    .attr('cy', yHistorical(lastDatum.close))
    .attr('r', outerRingRadius)
    .attr('fill', '#fff')
    .attr('stroke', '#17A2B8')
    .attr('stroke-width', 0) // grosor del anillo exterior
    .attr('fill-opacity', 0.8); // opacidad del anillo

  // Círculo interior
  svg.append('circle')
    .attr('cx', xHistorical(lastDatum.date))
    .attr('cy', yHistorical(lastDatum.close))
    .attr('r', innerCircleRadius)
    .attr('fill', '#17A2B8');
}

drawChart();
