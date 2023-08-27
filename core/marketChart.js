import { getPricesAndDates } from '../apis/coinGecko/index.js';

export function getDaysForFilter(filter) {
    switch (filter) {
        case '1D':
            return 1;
        case '5D':
            return 5;
        case '1M':
            return 30;
        case '3M':
            return 90;
        case '6M':
            return 180;
        case 'YTD':
            const startOfYear = new Date(new Date().getFullYear(), 0, 1);
            const today = new Date();
            return Math.ceil((today - startOfYear) / (1000 * 60 * 60 * 24));
        case '1Y':
            return 365;
        case '2Y':
            return 730;
        case '5Y':
            return 1825;
        case 'MAX':
            // max are 10 years
            return 3650;
        default:
            return 365; // Default to 1 year
    }
}

export async function drawMarketChart(filter = '5Y') {
    const days = getDaysForFilter(filter);
    var { dates, prices } = await getPricesAndDates(days);

    let maxHistoricValue = Math.max(...prices) * 1.3;

    var trace1 = {
        x: dates,
        y: prices,
        mode: 'lines',
        name: 'BTC'
    };

    var layout = {
        // title: 'Valor de Mercado BTC',
        xaxis: {
            // title: 'Tiempo',
            type: 'date'
        },
        yaxis: {
            // title: 'Valor del Mercado',
            range: [0, maxHistoricValue],
            // debe tener 8 ticks
            tickmode: 'linear',
            tick0: 0,
            dtick: maxHistoricValue / 7,
            tickformat: '$,.0f'
        },
        margin: {l: 50, r: 0, t: 20, b: 40},
    };

    var plotData = [trace1];

    Plotly.newPlot('marketChart', plotData, layout);
}

window.drawMarketChart = drawMarketChart;

drawMarketChart(); // Dibuja el gráfico con el filtro por defecto de 1 año
