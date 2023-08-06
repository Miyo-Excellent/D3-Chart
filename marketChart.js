import { getPricesAndDates } from './apis/coinGecko/index.js';

async function drawMarketChart() {
    // Fetch data from the CoinGecko API
    var {dates, prices} = await getPricesAndDates();

    var trace1 = {
        x: dates,
        y: prices,
        mode: 'lines',
        name: 'BTC'
    };

    var layout = {
        title: 'Valor de Mercado BTC',
        xaxis: {
            title: 'Tiempo',
            type: 'date'
        },
        yaxis: {
            title: 'Valor del Mercado',
            range: [0, 100000]
        },
    };

    var plotData = [trace1];

    Plotly.newPlot('marketChart', plotData, layout);
}

drawMarketChart();
