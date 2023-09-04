import { getMarketData } from '../apis/alphaVantage/index.js';
/**
 * @function drawManager
 * @description Gestiona el dibujo de los gráficos en función de los filtros de contexto y tiempo seleccionados.
 * @param {number} contextIndex - El índice del filtro de contexto seleccionado.
 * @param {number} timeDays - El número de días seleccionado en el filtro de tiempo.
 * @param {string} currency - La moneda seleccionada en el filtro de moneda.
 * @returns {void}
 * @example
 * drawManager(1, 7);
 * // Dibuja los gráficos con el filtro de contexto "1" = "Hibrid" y el filtro de tiempo "7" = "1 week".
 * @example
 * drawManager(0, 30);
 * // Dibuja los gráficos con el filtro de contexto "0" = "Market" y el filtro de tiempo "30" = "1 month".
 */

export const drawManager = (contextIndex, timeDays, currency) => {
    console.log('drawManager charts with context: ' + contextIndex + ' and time: ' + timeDays + ' and currency: ' + currency);
    switch (contextIndex) {
        case 0:
            // Market
            let marketData = getMarketData(timeDays);
            console.log(marketData);
            break;
        case 1:
            // Hibrid
            // getMarketData(timeDays);
            // getOutlookData(timeDays);
            break;
        case 2:
            // Outlook
            // getOutlookData(timeDays);
            break;
        default:
            console.log('Error: contextIndex out of range');
    }
};
