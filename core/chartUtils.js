import { buildHistoricalChart } from './historical.js';
import { buildProjectionChart } from './projection.js';

/**
 * Constructs the chart container.
 * @param {string} containerSelector - Selector for the container where the chart will be drawn.
 * @param {number} width - Width of the chart.
 * @param {number} height - Height of the chart.
 * @param {object} margin - Margin of the chart.
 * @param {number} context - Context in which the chart will be drawn.
 * @param {Array} data - Data to be used in the chart.
 * @param {number} timeframe - Timeframe for the chart data.
 */
export const buildChart = async (containerSelector, width, height, margin, context, data, timeframe) => {
    const svg = d3.select(containerSelector).append('svg')
        .attr('width', width)
        .attr('height', height);

    const middleWidth = width / 2;

    const projectionGroupSvg = svg.append('g');
    const historicalGroupSvg = svg.append('g');

    const latestDataPoint = data[data.length - 1];

    let maxPrice = d3.max(data, d => d.close * 1.3);
    maxPrice = maxPrice > latestDataPoint.close * 3 ? maxPrice : latestDataPoint.close * 3;

    const effectiveWidth = width - margin.left - margin.right;
    const effectiveHeight = height - margin.top - margin.bottom;

    createButtonContainer(width, margin.left, margin.right, context);

    const isOverflowing = (context === 1 || context === 2) && timeframe === 3650;

    let lastYearData = [];
    let lastYearLatestData = {};
    let currentYearFilteredData = [];
    if (timeframe === 0) {
        const today = new Date();
        const previousYear = today.getFullYear() - 1;
        const startOfLastYear = new Date(`${previousYear}-01-01`);
        const endOfLastYear = new Date(`${previousYear}-12-31T23:59:59`);
        lastYearData = data.filter(d => d.date >= startOfLastYear && d.date <= endOfLastYear);
        currentYearFilteredData = data.filter(d => d.date > endOfLastYear);
        lastYearLatestData = currentYearFilteredData[currentYearFilteredData.length - 1];
        data = lastYearData;
    }

    switch (context) {
        case 0:
            buildHistoricalChart(historicalGroupSvg, effectiveWidth, effectiveHeight, margin.left, margin.top, true, data, latestDataPoint, maxPrice, timeframe);
            break;
        case 1:
            buildProjectionChart(projectionGroupSvg, middleWidth - margin.right, effectiveHeight, middleWidth, margin.top, false, currentYearFilteredData, latestDataPoint, maxPrice, isOverflowing, timeframe);
            buildHistoricalChart(historicalGroupSvg, middleWidth - margin.left, effectiveHeight, margin.left, margin.top, false, data, latestDataPoint, maxPrice, timeframe);
            break;
        case 2:
            buildProjectionChart(projectionGroupSvg, effectiveWidth, effectiveHeight, margin.left, margin.top, true, currentYearFilteredData, latestDataPoint, maxPrice, isOverflowing, timeframe);
            break;
    }
};

/**
 * Constructs the button container.
 * @param {number} width - Width of the buttons.
 * @param {number} marginLeft - Left margin of the buttons.
 * @param {number} marginRight - Right margin of the buttons.
 * @param {number} context - Current chart context.
 */
export const createButtonContainer = (width, marginLeft, marginRight, context) => {
    d3.select('.button-bar')
        // .style('width', `${width}px`)
        // .style('margin-left', `${marginLeft}px`)
        // .style('margin-right', `${marginRight}px`)
        .style('display', 'flex');

    const displayStyle = context === 0 ? 'none' : 'flex';
    d3.select('.right-group').style('display', displayStyle);
};

/**
 * Updates the chart.
 * @param {string} containerSelector - Selector for the container where the chart will be redrawn.
 * @param {number} width - Width of the chart.
 * @param {number} height - Height of the chart.
 * @param {object} margin - Margin of the chart.
 * @param {number} context - Context in which the chart will be redrawn.
 * @param {Array} data - New data for the chart.
 * @param {number} timeframe - New timeframe for the chart.
 */
export async function updateChart(containerSelector, width, height, margin, context, data, timeframe) {
    d3.select(containerSelector).selectAll('svg').remove();
    await buildChart(containerSelector, width, height, margin, context, data, timeframe);
}
