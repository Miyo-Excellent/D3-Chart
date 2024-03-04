/**
 * @function getMarketData
 * @description Obtiene los precios de cierre y las fechas de los últimos días de una acción.
 * @param {string} symbol - El símbolo de la acción a consultar (ej: "MSFT", "AAPL", "GOOGL", etc.)
 * @param {int} days - El número de días a consultar (ej: 7, 30, 90, etc.)
 * @returns {object} - Un objeto con dos propiedades: "dates" y "prices", ambas son arrays.
**/

export async function getMarketData(days) {
    console.log('Fetching market data', days);
    const cachedData = localStorage.getItem('data');
    let isYtd = days === 0;

    if (cachedData) {
        console.log('Data from cache');
        const parsedData = JSON.parse(cachedData);
        let { dates, prices } = parsedData;

        const currentYear = new Date().getFullYear();
        const startOfLastYear = `${currentYear - 1}-01-01`;
        const endOfLastYear = `${currentYear - 1}-12-31`;

        if (isYtd) {
            const startIndex = dates.findIndex(date => date >= startOfLastYear);
            const endIndex = dates.findIndex(date => date > endOfLastYear) > -1 ? dates.findIndex(date => date > endOfLastYear) : dates.length;

            return {
                dates: dates.slice(startIndex, endIndex),
                prices: prices.slice(startIndex, endIndex)
            };
        } else {
            // Caso no YTD: devolver los días solicitados
            const todayStr = new Date().toISOString().slice(0, 10);
            const latestDateInCache = dates[dates.length - 1];
            if (latestDateInCache >= todayStr) {
                const startIndex = Math.max(dates.length - days, 0);
                return {
                    dates: dates.slice(startIndex),
                    prices: prices.slice(startIndex)
                };
            } else {
                // Los datos necesitan ser actualizados
                return await fetchAndSaveMarketData(days, isYtd);
            }
        }
    } else {
        // No hay datos en caché, obtenemos nuevos datos
        return await fetchAndSaveMarketData(days, isYtd);
    }
}



async function fetchAndSaveMarketData(days, isYtd) {
    let queryDays = isYtd ? '365' : days; // Si es YTD, obtenemos datos del último año

    try {
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=${queryDays}`);
        const data = await response.json();

        let dates = data.prices.map(price => {
            const date = new Date(price[0]);
            return date.toISOString().slice(0, 10);
        });

        let prices = data.prices.map(price => price[1]);

        // Ajusta aquí si necesitas manejar la lógica de YTD de manera diferente

        const filledData = fillMissingDates(dates, prices);
        localStorage.setItem('data', JSON.stringify(filledData));
        return filledData;
    } catch (error) {
        console.error('Error fetching market data:', error);
        return null;
    }
}


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
            filledPrices.push(prices[i]); // Repetimos el último precio conocido
            dayDifference--;
        }
    }

    // Añadimos el último día
    filledDates.push(dates[dates.length - 1]);
    filledPrices.push(prices[prices.length - 1]);

    return { dates: filledDates, prices: filledPrices };
};
