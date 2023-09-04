
export async function drawMarketChart(dates, prices, highestPrice) {
    var trace1 = {
        x: dates,
        y: prices,
        mode: 'lines',
        name: 'BTC'
    };

    var layout = {
        xaxis: {
            type: 'date'
        },
        yaxis: {
            range: [0, highestPrice],
            tickmode: 'linear',
            tick0: 0,
            dtick: highestPrice / 10,
            tickformat: '$,.0f'
        },
        margin: {l: 50, r: 0, t: 20, b: 40},
    };

    var plotData = [trace1];

    Plotly.newPlot('marketChart', plotData, layout);
}

// window.drawMarketChart = drawMarketChart;
