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
    let isYtd = false;

    if (days == 0) {
        isYtd = true;
        days = 365 * 3; // Considera los últimos 3 años
    }

    if (cachedData) {
        console.log('Data from cache');
        const parsedData = JSON.parse(cachedData);

        let { dates, prices } = parsedData;

        if (isYtd) {
            const today = new Date();
            const lastYear = today.getFullYear() - 1;

            const lastYearStart = dates.findIndex(date => date.startsWith(lastYear));
            const lastYearEnd = dates.findIndex(date => date.startsWith(today.getFullYear()));

            dates = dates.slice(lastYearStart, lastYearEnd);
            prices = prices.slice(lastYearStart, lastYearEnd);
        } else if (dates.length >= days) {
            const startIndex = dates.length - days;
            dates = dates.slice(startIndex);
            prices = prices.slice(startIndex);
        } else {
            // Si los datos en caché no son suficientes, se procederá a obtener nuevos datos.
            return await fetchAndSaveMarketData(days, isYtd);
        }


        console.log('Returning data from cache', {
            dates,
            prices
        });

        return { dates, prices };
    }

    // Función separada para manejar la obtención y guardado de nuevos datos
    return await fetchAndSaveMarketData(days, isYtd);
}

async function fetchAndSaveMarketData(days, isYtd) {
    try {
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=${days}`);
        const data = await response.json();

        let dates = data.prices.map(price => {
            const date = new Date(price[0]);
            return date.toISOString().slice(0, 10);
        });

        let prices = data.prices.map(price => price[1]);

        // Manejo de YTD para datos recién obtenidos
        if (isYtd) {
            const today = new Date();
            const lastYear = today.getFullYear() - 1;

            const lastYearStart = dates.findIndex(date => date.startsWith(lastYear));
            const lastYearEnd = dates.findIndex(date => date.startsWith(today.getFullYear()));

            dates = dates.slice(lastYearStart, lastYearEnd);
            prices = prices.slice(lastYearStart, lastYearEnd);
        }

        localStorage.setItem('data', JSON.stringify({ dates, prices }));
        console.log('Saving data to cache');

        return { dates, prices };
    } catch (error) {
        console.error('Error fetching market data:', error);
        return null;
    }
}
