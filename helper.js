export const createRect = (group, x, y, w, h, fill) => {
    group.append('rect')
      .attr('x', x)
      .attr('y', y)
      .attr('width', w)
      .attr('height', h)
      .attr('fill', fill);
  };