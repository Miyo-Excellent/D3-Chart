/**
 * Helper functions for creating SVG elements
 */


/**
 * Creates a rectangle element
 * @param {Object} group D3 selection of a group element
 * @param {number} x x coordinate
 * @param {number} y y coordinate
 * @param {number} w width
 * @param {number} h height
 * @param {string} fill fill color
 */
export const createRect = (group, x, y, w, h, fill) => {
    group.append('rect')
      .attr('x', x)
      .attr('y', y)
      .attr('width', w)
      .attr('height', h)
      .attr('fill', fill);
  };