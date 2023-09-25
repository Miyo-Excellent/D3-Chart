/**
 * @function getMarketData
 * @description Obtiene los precios de cierre y las fechas de los últimos días de una acción.
 * @param {string} symbol - El símbolo de la acción a consultar (ej: "MSFT", "AAPL", "GOOGL", etc.)
 * @param {int} days - El número de días a consultar (ej: 7, 30, 90, etc.)
 * @returns {object} - Un objeto con dos propiedades: "dates" y "prices", ambas son arrays.
 * @example
 * getMarketData("MSFT", 7);
 * // Devuelve un objeto con dos arrays: "dates" y "prices".
 * // "dates" contiene las fechas de los últimos 7 días.
 * // "prices" contiene los precios de cierre de los últimos 7 días.
 */

// export function getMarketData(symbol, days) {
//     const apiKey = "UATD58NS66E6ZBZS";
//     return fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&apikey=${apiKey}`)
//         .then(response => response.json())
//         .then(data => {
//             const timeSeries = data['Time Series (Daily)'];
//             const dates = Object.keys(timeSeries).slice(0, days);
//             const prices = dates.map(date => parseFloat(timeSeries[date]['4. close']));

//             return {
//                 dates: dates,
//                 prices: prices
//             };
//         })
//         .catch(error => console.error(error));
// }


export function getMarketData(days) {
    console.log('Executing getMarketData');
    return fetch(`https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=${days}`)
        .then(response => response.json())
        .then(data => {
            var dates = data.prices.map(price => {
                var date = new Date(price[0]);
                return date.toISOString().slice(0, 10);
            });

            var prices = data.prices.map(price => price[1]);

            return {
                dates: dates,
                prices: prices
            };
        })
        .catch(error => console.error(error));
}