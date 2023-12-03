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