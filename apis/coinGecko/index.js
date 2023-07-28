export function getLastPrice() {
    return fetch('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=200')
        .then(response => response.json())
        .then(data => {
            // El último precio es el último elemento de data.prices
            return data.prices[data.prices.length - 1][1];
        })
        .catch(error => console.error(error));
}

export function getPricesAndDates() {
    return fetch('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=200')
        .then(response => response.json())
        .then(data => {
            var dates = data.prices.map(price => {
                var date = new Date(price[0]);
                return date.toISOString().slice(0, 10); // Convert timestamp to date string
            });
    
            var prices = data.prices.map(price => price[1]);

            return {
                dates: dates,
                prices: prices
            };
        })
        .catch(error => console.error(error));
}