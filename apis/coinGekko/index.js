/**
 * @async
 * @function fetchMarketData
 * @description Fetches closing prices and dates for a given symbol over a specified number of days.
 * @param {number} days - The number of days to fetch data for.
 * @returns {Promise<Object|null>} - An object containing 'dates' and 'prices' arrays, or null if an error occurs.
 */
export async function fetchMarketData(days) {
    const cachedData = localStorage.getItem('marketData');

    if (cachedData) {
        const { dates, prices } = JSON.parse(cachedData);
        return filterDataByTimeSpan(dates, prices, days);
    } else {
        const freshData = await retrieveAndStoreMarketData(days);
        return freshData ? filterDataByTimeSpan(freshData.dates, freshData.prices, days) : null;
    }
}

/**
 * @async
 * @function retrieveAndStoreMarketData
 * @description Fetches market data for the past specified days and stores it in local storage.
 * @param {number} days - The number of days to fetch data for.
 * @returns {Promise<Object|null>} - The market data object or null if an error occurs.
 */
async function retrieveAndStoreMarketData(days) {
    const period = days === 0 ? 'max' : days.toString();

    try {
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=${period}`);
        const { prices } = await response.json();

        const dates = prices.map(item => (new Date(item[0])).toISOString().slice(0, 10));
        const values = prices.map(item => item[1]);

        const structuredData = structureDatePriceData(dates, values);
        localStorage.setItem('marketData', JSON.stringify(structuredData));
        return structuredData;
    } catch (error) {
        console.error('Error fetching market data:', error);
        return null;
    }
}

/**
 * @function filterDataByTimeSpan
 * @description Filters market data based on a specified time span.
 * @param {Array<string>} dates - The array of date strings.
 * @param {Array<number>} prices - The array of prices.
 * @param {number} days - The number of days for the time span.
 * @returns {Object} - An object containing filtered 'dates' and 'prices'.
 */
const filterDataByTimeSpan = (dates, prices, days) => {
    const { start, end } = calculateTimeSpan(days);
    const startDateStr = start.toISOString().slice(0, 10);
    const endDateStr = end ? end.toISOString().slice(0, 10) : startDateStr;

    const startIndex = dates.findIndex(date => date >= startDateStr);
    const endIndex = end ? dates.findIndex(date => date > endDateStr) : dates.length;

    return {
        dates: dates.slice(startIndex, endIndex),
        prices: prices.slice(startIndex, endIndex)
    };
};

/**
 * @function structureDatePriceData
 * @description Structures dates and prices data, filling in missing dates.
 * @param {Array<string>} dates - The array of date strings.
 * @param {Array<number>} prices - The array of prices.
 * @returns {Object} - An object containing structured 'dates' and 'prices'.
 */
const structureDatePriceData = (dates, prices) => {
    let structuredDates = [];
    let structuredPrices = [];

    for (let i = 0; i < dates.length - 1; i++) {
        structuredDates.push(dates[i]);
        structuredPrices.push(prices[i]);

        let currentDate = new Date(dates[i]);
        let nextDate = new Date(dates[i + 1]);
        let dayGap = (nextDate - currentDate) / (1000 * 3600 * 24);

        while (dayGap > 1) {
            currentDate.setDate(currentDate.getDate() + 1);
            structuredDates.push(currentDate.toISOString().slice(0, 10));
            structuredPrices.push(prices[i]);
            dayGap--;
        }
    }

    structuredDates.push(dates[dates.length - 1]);
    structuredPrices.push(prices[prices.length - 1]);

    return { dates: structuredDates, prices: structuredPrices };
};

/**
 * @function calculateTimeSpan
 * @description Calculates the start and end dates for a given time span in days.
 * @param {number} days - The number of days for the time span.
 * @returns {Object} - An object containing 'start' and 'end' Date objects.
 */
const calculateTimeSpan = (days) => {
    const today = new Date();
    switch (days) {
        case 0:
            return { start: new Date(`${today.getFullYear() - 1}-01-01`), end: null };
        case 2:
            return { start: new Date(today.setDate(today.getDate() - 1)), end: null };
        case 7:
            return { start: new Date(today.setDate(today.getDate() - 7)), end: null };
        case 31:
            return { start: new Date(today.setMonth(today.getMonth() - 1)), end: null };
        case 1825:
            return { start: new Date(today.setFullYear(today.getFullYear() - 5)), end: null };
        case 3650:
            return { start: new Date(today.setFullYear(today.getFullYear() - 10)), end: null };
        default:
            return { start: null, end: null };
    }
}