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


export async function getMarketData(days) {
    const cachedData = localStorage.getItem('data');
    
    if (cachedData) {
        console.log('Data from cache');
        const parsedData = JSON.parse(cachedData);
        
        if (parsedData.dates.length >= days) {
            const dates = parsedData.dates.slice(0, days);
            const prices = parsedData.prices.slice(0, days);
            return { dates, prices };
        }
    }

    try {
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=${days}`);
        const data = await response.json();
        
        const dates = data.prices.map(price => {
            const date = new Date(price[0]);
            return date.toISOString().slice(0, 10);
        });

        const prices = data.prices.map(price => price[1]);

        localStorage.setItem('data', JSON.stringify({dates, prices}));
        console.log('Saving data to cache');

        return { dates, prices };
    } catch (error) {
        console.error('Error fetching market data:', error);
    }
}