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

async function retrieveAndStoreMarketData(days) {
    // const { start, end } = calculateTimeSpan(days);
    // const startDateStr = start.toISOString().slice(0, 10);
    // const endDateStr = end ? end.toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
    
    try {
        const API_KEY = 'd3324fcbc759421cb94971b656e0ba8e';
        // 
        const response = await fetch(`https://api.twelvedata.com/time_series?symbol=BTC/USD&apikey=${API_KEY}&interval=1day&outputsize=5000`);
        const data = await response.json();
        const { values } = data;

        const dates = values.map(item => item.datetime);
        const prices = values.map(item => parseFloat(item.close));

        const structuredData = structureDatePriceData(dates, prices);
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