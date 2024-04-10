/**
 * @async
 * @function fetchMarketData
 * @description Fetches closing prices and dates for a given symbol over the past 10 years.
 * @returns {Promise<Object|null>} - An object containing 'dates' and 'prices' arrays, or null if an error occurs.
 */
export async function fetchMarketData() {
    const cachedData = localStorage.getItem('marketData');

    if (cachedData) {
        return JSON.parse(cachedData);
    } else {
        const freshData = await retrieveAndStoreMarketData();
        return freshData || null;
    }
}

/**
 * @async
 * @function retrieveAndStoreMarketData
 * @description Fetches market data for the past 10 years and stores it in local storage.
 * @returns {Promise<Object|null>} - The market data object or null if an error occurs.
 */
async function retrieveAndStoreMarketData() {
    const apiKey = 'PG3LFWR0R0DMHKEZ';
    const symbol = 'BTC';
    const functionType = 'DIGITAL_CURRENCY_DAILY';

    try {
        const response = await fetch(`https://www.alphavantage.co/query?function=${functionType}&symbol=${symbol}&market=USD&apikey=${apiKey}`);
        if (!response.ok) throw new Error('Network response was not ok.');

        const data = await response.json();
        const timeSeries = data['Time Series (Digital Currency Daily)'];
        const dates = Object.keys(timeSeries);
        const prices = dates.map(date => timeSeries[date]['4a. close (USD)']);

        const structuredData = { dates, prices };
        localStorage.setItem('marketData', JSON.stringify(structuredData));
        return structuredData;
    } catch (error) {
        console.error('Error fetching market data:', error);
        return null;
    }
}
