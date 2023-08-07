// Path: core\filters.js
// those filters are for getting the data filtered from coinGecko API and then we need update the data in the graph with the new data

function getDaysForFilter(filter) {
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
        default:
            return 365; // Default to 1 year
    }
}

export function drawMarketChartWithFilter(filter, drawMarketChart) {
    drawMarketChart(getDaysForFilter(filter));
}


