export const fetchMarketData = async () => {
    const cachedData = localStorage.getItem('marketData');
    if (cachedData) {
      const { dates, prices } = JSON.parse(cachedData);
      const lastCachedDate = new Date(dates[0]);
      const today = new Date();
  
      // Se ajusta 'today' para asegurar la comparación solo en términos de fecha, sin considerar el tiempo
      today.setHours(0, 0, 0, 0);
      
      return processData(dates, prices);
      if (lastCachedDate >= today) {
        // Los datos del caché están actualizados
        return processData(dates, prices);
      } else {
        // Los datos del caché están desactualizados, se necesita obtener datos frescos
        const freshData = await retrieveAndStoreMarketData();
        return freshData ? processData(freshData.dates, freshData.prices) : null;
      }
    } else {
      // No hay datos en el caché, se necesita obtener datos frescos
      const freshData = await retrieveAndStoreMarketData();
      return freshData ? processData(freshData.dates, freshData.prices) : null;
    }
  };
  
  const retrieveAndStoreMarketData = async () => {
    try {
      const API_KEY = 'd3324fcbc759421cb94971b656e0ba8e';
      const response = await fetch(`https://api.twelvedata.com/time_series?symbol=BTC/USD:BITFINEX&apikey=${API_KEY}&interval=1day&outputsize=3650`);
      const data = await response.json();
      const { values } = data;
  
      const dates = values.map(item => item.datetime);
      const prices = values.map(item => parseFloat(item.close));
  
      const structuredData = { dates, prices };
      localStorage.setItem('marketData', JSON.stringify(structuredData));
      return structuredData;
    } catch (error) {
      console.error('Error fetching market data:', error);
      return null;
    }
  };
  
  const processData = (dates, prices) => {
    let data = dates.map((date, index) => ({
      date: new Date(date + 'T00:00:00'),
      close: prices[index]
    }));
  
    return data.reverse();
  };
  