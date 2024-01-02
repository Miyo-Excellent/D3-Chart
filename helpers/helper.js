/**
 * Helper functions for creating SVG elements
 */


/**
 * Creates a rectangle element
 * @param {Object} group D3 selection of a group element
 * @param {number} x x coordinate
 * @param {number} y y coordinate
 * @param {number} width width
 * @param {number} height height
 * @param {string} fill fill color
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
 * Creates format for the y axis
 * @param {number} d D3 selection of a group element
 * @returns {string} formatted value
 */
export const valueInThousands = d => {
  if (d === 0) {
    return "$0K";
  }
  const valueInThousands = d / 1000;
  return `$${valueInThousands.toFixed(1)}K`;
};

export const tickValues = (highestValue, tickCount, length) => {
  const tickInterval = highestValue / tickCount;
  return Array.from({ length: length }, (_, i) => i * tickInterval);
}

export const buildCircle = (group, xPosition, yPosition, xScale, yScale, lastData, isProjection = false) => {

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
      .attr('stroke', '#17A2B8')
      .attr('stroke-width', 1.5)
      .attr('fill-opacity', 0.8);

  // Outer ring animation
  outerRing.transition()
      .duration(3000)
      .attr('r', outerRingRadius);

  const innerCircle = group.append('circle')
      .attr('cx', circleX)
      .attr('cy', circleY)
      .attr('r', 0) 
      .attr('fill', '#17A2B8');

  // Inner circle animation
  innerCircle.transition()
      .duration(1000)
      .delay(1000)
      .attr('r', innerCircleRadius);
}