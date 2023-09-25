import { getMarketData } from './apis/coinGekko/index.js';

async function drawChart() {
  const { dates, prices } = await getMarketData(365 * 10);

  const data = dates.map((date, index) => ({
    date: new Date(date),
    close: prices[index]
  }));

  const width = 928;
  const height = 500;
  const margin = { top: 20, right: 30, bottom: 50, left: 70 };

  const x = d3.scaleUtc()
    .domain(d3.extent(data, d => d.date))
    .range([margin.left, width - margin.right]);

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.close)])
    .range([height - margin.bottom, margin.top])
    .nice();

  const area = d3.area()
    .x(d => x(d.date))
    .y0(y(0))
    .y1(d => y(d.close));

  const line = d3.line()
    .x(d => x(d.date))
    .y(d => y(d.close));

  const svg = d3.select('#marketChart').append('svg')
    .attr('width', width)
    .attr('height', height)
    .style('background-color', '#293C4B')
    .style('border-radius', '10px');

  // Lower the y-axis grid lines
  const yAxisGrid = svg.append('g')
    .attr('class', 'y axis-grid')
    .attr('transform', `translate(${margin.left},0)`);
  yAxisGrid
    .call(d3.axisLeft(y).tickSize(-(width - margin.left - margin.right)).tickFormat(''))
    .selectAll('.tick line')
    .attr('stroke', '#3A4B59');
  yAxisGrid.lower();

  const gradient = svg.append("defs")
    .append("linearGradient")
    .attr("id", "areaGradient")
    .attr("gradientUnits", "userSpaceOnUse")
    .attr("x1", 0).attr("y1", y(0))
    .attr("x2", 0).attr("y2", y(d3.max(data, d => d.close)))
    .selectAll("stop")
    .data([
      { offset: "0%", color: "rgba(30, 41, 52, 0.70)" },
      { offset: "53.57%", color: "rgba(9, 39, 56, 0.08)" },
      { offset: "100%", color: "rgba(0, 0, 0, 0.00)" }
    ])
    .enter().append("stop")
    .attr("offset", d => d.offset)
    .attr("stop-color", d => d.color);

  svg.append('path')
    .datum(data)
    .attr('fill', 'url(#areaGradient)')
    .attr('d', area);

  svg.append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', '#17A2B8')
    .attr('stroke-width', 1.5)
    .attr('d', line);

  const xAxis = svg.append('g')
    .attr('transform', `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).tickSize(0));

  const yAxis = svg.append('g')
    .attr('transform', `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).tickSize(0).tickFormat(d3.format(".2s")));

  // Hide the domain line of both axes
  xAxis.select('.domain').attr('stroke', 'none');
  yAxis.select('.domain').remove();


  // Style for axis labels
  xAxis.selectAll("text")
    .attr("dy", "1.5em")
    .style("font-family", "Montserrat")
    .style("font-size", "12px")
    .style("font-weight", "500")
    .style("line-height", "15px")
    .style("letter-spacing", "0.4285714030265808px")
    .style("text-align", "center")
    .style("color", "#D6D9DC");

  yAxis.selectAll("text")
    .attr("dx", "-1.5em")
    .style("font-family", "Montserrat")
    .style("font-size", "12px")
    .style("font-weight", "500")
    .style("line-height", "15px")
    .style("letter-spacing", "0.4285714030265808px")
    .style("text-align", "center")
    .style("color", "#D6D9DC");
}

drawChart();
