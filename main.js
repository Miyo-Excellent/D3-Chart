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

  const width = 2540;
  const height = 540;
  const margin = { top: 20, right: 70, bottom: 50, left: 70 };

  const svg = d3.select('#marketChart').append('svg')
    .attr('width', width)
    .attr('height', height);

  const xHistorical = d3.scaleUtc()
    .domain(d3.extent(data, d => d.date))
    .range([margin.left, width / 2]);

  const yHistorical = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.close)])
    .range([height - margin.bottom, margin.top])
  // .nice();

  // Calcula el valor máximo ajustado
  const max = d3.max(data, d => d.close);
  const adjustedMax = max * 1.3;  // 30% más alto que el máximo

  // Ajusta el dominio de la escala yHistorical
  yHistorical.domain([0, adjustedMax]);

  // Calcula los tickValues
  const tickInterval = adjustedMax / 9;  // 9 intervalos para crear 10 ticks
  const tickValues = Array.from({ length: 10 }, (_, i) => i * tickInterval);


  // Líneas horizontales para ambos gráficos
  const yAxisGrid = svg.append('g')
    .attr('transform', `translate(${margin.left},0)`);

  yAxisGrid
    .call(d3.axisLeft(yHistorical).tickSize(-(width - margin.left - margin.right)).tickFormat('').tickValues(tickValues))
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

  const today = new Date();

  const generateProjections = generateDummyProjectionsData(today, '2033-01-01', lastDatum.close);
  const projectionData = generateProjections.map(p => ({
    startDate: new Date(p.start_date),
    endDate: new Date(p.end_date),
    minValue: p.min_value,
    maxValue: p.max_value
  }));

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
    .attr("dy", "2.2em");

  xAxisHistorical.select(".domain").remove();


  const xAxisProjection = svg.append('g')
    .attr('transform', `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(xProjection).tickSize(0))
    .attr('stroke-opacity', 0)
    .selectAll("text")
    .attr("dy", "2.2em");

  xAxisProjection.select(".domain").remove();

  const formatYAxis = d => {
    if (d === 0) {
      return "$0K";
    }
    const valueInThousands = d / 1000;
    return `$${valueInThousands.toFixed(1)}K`;
  };

  const yAxisLeft = svg.append('g')
    .attr('transform', `translate(${margin.left},0)`)
    .call(d3.axisLeft(yHistorical).tickSize(0).tickFormat(formatYAxis).tickValues(tickValues));

  yAxisLeft.select(".domain").remove();

  yAxisLeft.selectAll("text")
    .attr("dx", "-0.8em");

  const yAxisRight = svg.append('g')
    .attr('transform', `translate(${width - margin.right},0)`)
    .call(d3.axisRight(yHistorical).tickSize(-(width - width / 2 - margin.right)).tickFormat(formatYAxis).tickValues(tickValues));

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
  // Contenedor para la línea del gráfico histórico
  const lineContainer = svg.append('g');

  generateProjections.forEach(p => {
    const xStart = xProjection(new Date(p.start_date));
    const xEnd = xProjection(new Date(p.end_date));
    const yMax = yHistorical(p.max_value);
    const yMin = yHistorical(p.min_value);
    const yLastDatum = yHistorical(lastDatum.close);

    if (p.min_value <= lastDatum.close && p.max_value >= lastDatum.close) {
      // Si la proyección cruza el valor actual, dibuja dos rectángulos
      // Parte inferior (menor al valor actual)
      svg.append('rect')
        .attr('x', xStart)
        .attr('y', yLastDatum)
        .attr('width', xEnd - xStart)
        .attr('height', yMin - yLastDatum)
        .attr('rx', 5)
        .attr('ry', 5)
        .attr('fill', '#ED5666');

      // Cubre la parte superior para eliminar el redondeo
      svg.append('rect')
        .attr('x', xStart)
        .attr('y', yLastDatum)  // Empieza donde comienza el rectángulo principal
        .attr('width', xEnd - xStart)
        .attr('height', 5)  // Solo cubre el área redondeada
        .attr('fill', '#ED5666');

      // Parte superior (mayor al valor actual)
      svg.append('rect')
        .attr('x', xStart)
        .attr('y', yMax)
        .attr('width', xEnd - xStart)
        .attr('height', yLastDatum - yMax)
        .attr('rx', 5)
        .attr('ry', 5)
        .attr('fill', '#24C6C8');

      // Cubre la parte inferior para eliminar el redondeo
      svg.append('rect')
        .attr('x', xStart)
        .attr('y', yLastDatum - 5)  // Empieza donde termina el redondeo
        .attr('width', xEnd - xStart)
        .attr('height', 5)  // Solo cubre el área redondeada
        .attr('fill', '#24C6C8');

    } else {
      // Si la proyección no cruza el valor actual, dibuja un solo rectángulo
      const color = p.max_value < lastDatum.close ? '#ED5666' : '#24C6C8';
      svg.append('rect')
        .attr('x', xStart)
        .attr('y', yMax)
        .attr('width', xEnd - xStart)
        .attr('height', yMin - yMax)
        .attr('rx', 5)
        .attr('ry', 5)
        .attr('fill', color);
    }
  });



  const path = lineContainer.append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', '#17A2B8')
    .attr('stroke-width', 1.5)
    .attr('d', lineHistorical);

  const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  const focus = svg.append("g")
    .attr("class", "focus")
    .style("display", "none");

  focus.append("circle")
    .attr("r", outerRingRadius)  // Usa el mismo radio que el anillo exterior
    .attr("fill", "#fff")  // Relleno blanco
    .attr("stroke", "#17A2B8")  // Borde turquesa
    .attr("stroke-width", 0)  // Grosor del borde
    .attr("fill-opacity", 0.8);  // Opacidad

  focus.append("circle")
    .attr("class", "innerCircle")
    .attr("r", innerCircleRadius)  // Usa el mismo radio que el círculo interior
    .attr("fill", "#17A2B8");  // Relleno turquesa

  svg.append("rect")
    .attr("class", "overlay")
    .attr("x", margin.left) // Limita el área activa al gráfico histórico
    .attr("y", margin.top)  // Limita el área activa al gráfico histórico
    .attr("width", width / 2 - margin.left) // Ancho de la gráfica histórica
    .attr("height", height - margin.top - margin.bottom) // Altura del área activa
    .style("opacity", 0)  // es transparente
    .on("mouseover", () => {
      focus.style("display", null);
      tooltip.style("opacity", .9);
    })
    .on("mouseout", () => {
      focus.style("display", "none");
      tooltip.style("opacity", 0);
    })
    .on("mousemove", mousemove);

  function mousemove(event) {
    const bisectDate = d3.bisector(d => d.date).left;
    const x0 = xHistorical.invert(d3.pointer(event)[0]),
      i = bisectDate(data, x0, 1),
      d0 = data[i - 1],
      d1 = data[i],
      d = x0 - d0.date > d1.date - x0 ? d1 : d0;

    focus.attr("transform", `translate(${xHistorical(d.date)},${yHistorical(d.close)})`);
    tooltip.style("opacity", .9);

    tooltip.html(`$${d.close.toFixed(2)}`)
      .style("left", `${event.pageX + 5}px`)
      .style("top", `${event.pageY - 28}px`);
  }


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

const generateDummyProjectionsData = (startDate, endDate, valorActual) => {
  const proyecciones = [];
  const meses = [];

  let currentDate = new Date(startDate);

  while (currentDate <= new Date(endDate)) {
    meses.push(new Date(currentDate));
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  // Desordenar el array de meses para elegir aleatoriamente
  meses.sort(() => 0.5 - Math.random());

  for (let i = 0; i < 10 && meses[i]; i++) {
    const max = valorActual + Math.random() * (87.9 * 1000 - valorActual);
    const min = Math.random() * max;

    const inicioPeriodo = new Date(meses[i].getFullYear(), meses[i].getMonth(), 1);
    const finPeriodo = new Date(meses[i].getFullYear(), meses[i].getMonth() + 1, 0);

    proyecciones.push({
      min_value: min,
      max_value: max,
      start_date: inicioPeriodo.toISOString().split('T')[0],
      end_date: finPeriodo.toISOString().split('T')[0]
    });
  }

  // Ordenar por fecha de inicio
  proyecciones.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));

  return proyecciones;
};