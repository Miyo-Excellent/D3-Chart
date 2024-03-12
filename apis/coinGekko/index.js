/**
 * @function getMarketData
 * @description Obtiene los precios de cierre y las fechas de los últimos días de una acción.
 * @param {string} symbol - El símbolo de la acción a consultar (ej: "MSFT", "AAPL", "GOOGL", etc.)
 * @param {int} days - El número de días a consultar (ej: 7, 30, 90, etc.)
 * @returns {object} - Un objeto con dos propiedades: "dates" y "prices", ambas son arrays.
**/

export async function getMarketData(days) {
    const cachedData = localStorage.getItem('data');

    if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        return filterDataByDate(parsedData.dates, parsedData.prices, days);
    } else {
        let freshData = await fetchAndSaveMarketData(days);
        if (freshData) {
            return filterDataByDate(freshData.dates, freshData.prices, days);
        } else {
            return null;
        }
    }
}

async function fetchAndSaveMarketData(days) {
    let queryDays = days == 0 ? '700' : days;

    try {
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=${queryDays}`);
        const data = await response.json();

        let dates = data.prices.map(price => {
            const date = new Date(price[0]);
            return date.toISOString().slice(0, 10);
        });

        let prices = data.prices.map(price => price[1]);

        const filledData = fillMissingDates(dates, prices);
        localStorage.setItem('data', JSON.stringify(filledData));
        return filledData;
    } catch (error) {
        console.error('Error fetching market data:', error);
        return null;
    }
}

const filterDataByDate = (dates, prices, days) => {
    const { start, end } = getStartDateFromDays(days);
    const startDateStr = start.toISOString().slice(0, 10);
    const endDateStr = end ? end.toISOString().slice(0, 10) : start.toISOString().slice(0, 10); // Si no hay 'end', usar 'start'

    const startIndex = dates.findIndex(date => date >= startDateStr);
    const endIndex = end ? dates.findIndex(date => date > endDateStr) : dates.length;

    return {
        dates: dates.slice(startIndex, endIndex),
        prices: prices.slice(startIndex, endIndex)
    };
};


const fillMissingDates = (dates, prices) => {
    let filledDates = [];
    let filledPrices = [];

    for (let i = 0; i < dates.length - 1; i++) {
        filledDates.push(dates[i]);
        filledPrices.push(prices[i]);

        let currentDate = new Date(dates[i]);
        let nextDate = new Date(dates[i + 1]);
        let dayDifference = (nextDate - currentDate) / (1000 * 3600 * 24);

        while (dayDifference > 1) {
            currentDate.setDate(currentDate.getDate() + 1);
            filledDates.push(currentDate.toISOString().slice(0, 10));
            filledPrices.push(prices[i]);
            dayDifference--;
        }
    }

    filledDates.push(dates[dates.length - 1]);
    filledPrices.push(prices[prices.length - 1]);

    return { dates: filledDates, prices: filledPrices };
};

const getStartDateFromDays = (days) => {
    const today = new Date();
    switch (days) {
        case 0: // YTD custom, el año completo anterior
            return {
                start: new Date(`${today.getFullYear() - 1}-01-01`),
                end: null
            };
        case 2:
            return {
                start: new Date(today.setDate(today.getDate() - 1)),
                end: null
            };
        case 7: // Semana pasada
            return { start: new Date(today.setDate(today.getDate() - 7)), end: null };
        case 31: // Mes anterior
            return { start: new Date(today.setMonth(today.getMonth() - 1)), end: null };
        case 1825: // 5 años
            return { start: new Date(today.setFullYear(today.getFullYear() - 5)), end: null };
        case 3650: // 10 años
            return { start: new Date(today.setFullYear(today.getFullYear() - 10)), end: null };
        default:
            return { start: null, end: null };
    }
}