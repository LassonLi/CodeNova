const yahooFinance = require('yahoo-finance2').default;

const stockSymbols = [
    'AAPL', 'MSFT', 'GOOG', 'GOOGL', 'META', 'AMZN', 'NVDA', 'TSLA', 'AMD', 'INTC',
    'JPM', 'BAC', 'WFC', 'GS', 'MS', 'AXP',
    'JNJ', 'PFE', 'MRK', 'UNH', 'LLY', 'ABT',
    'PG', 'KO', 'PEP', 'MCD', 'SBUX', 'NKE', 'DIS', 'COST', 'WMT', 'HD',
    'XOM', 'CVX', 'BP', 'TOT', 'COP', 'SLB',
    'BA', 'GE', 'CAT', 'UPS', 'FDX', 'DE',
    'NEE', 'DUK', 'SO', 'AEP', 'EXC',
    'BABA', 'TM', 'NSANY', 'TCEHY', 'RY', 'TD',
    'SPY', 'QQQ', 'ARKK', 'VTI', 'IWM', 'DIA'
];

exports.getStockPrice = async (symbol) => {
    try {
        const result = await yahooFinance.quote(symbol);
        return {
            symbol: result.symbol,
            price: result.regularMarketPrice,
            currency: result.currency,
            time: result.regularMarketTime,
        };
    } catch (error) {
        console.error(`Failed to fetch price for ${symbol}:`, error.message);
        throw new Error('Could not fetch stock price');
    }
};

exports.getRandomStockPrices = async () => {
    const selected = stockSymbols.sort(() => 0.5 - Math.random()).slice(0, 6);

    try {
        const results = await Promise.all(
            selected.map(async (symbol) => {
                const quote = await yahooFinance.quote(symbol);
                return {
                    symbol: quote.symbol,
                    price: quote.regularMarketPrice,
                    change: quote.regularMarketChange,
                    percentChange: quote.regularMarketChangePercent,
                    currency: quote.currency
                };
            })
        );

        return results;
    } catch (err) {
        console.error('Failed to fetch stock prices:', err.message);
        throw new Error('Stock data fetch failed');
    }
};
