// helpers/plotData.js

function createTrace(projection, color) {
    return {
        x: [projection.startTime, projection.endTime, projection.endTime, projection.startTime],
        y: [projection.minPrice, projection.minPrice, projection.maxPrice, projection.maxPrice],
        fill: 'toself',
        mode: 'lines',
        name: projection.userName,
        fillcolor: color,
        line: {
            color: color,
        }
    };
}

function splitProjection(projection, lastPrice) {
    var above = {
        startTime: projection.startTime,
        endTime: projection.endTime,
        minPrice: lastPrice,
        maxPrice: projection.maxPrice,
        userName: projection.userName,
    };

    var below = {
        startTime: projection.startTime,
        endTime: projection.endTime,
        minPrice: projection.minPrice,
        maxPrice: lastPrice,
        userName: projection.userName,
    };

    return [above, below];
}

export function generatePlotData(projections, lastPrice) {
    var plotData = [];

    projections.forEach((projection) => {
        if (projection.minPrice > lastPrice) {
            plotData.push(createTrace(projection, 'green'));
        } else if (projection.maxPrice < lastPrice) {
            plotData.push(createTrace(projection, 'red'));
        } else {
            var [above, below] = splitProjection(projection, lastPrice);
            plotData.push(createTrace(above, 'green'));
            plotData.push(createTrace(below, 'red'));
        }
    });

    return plotData;
}
