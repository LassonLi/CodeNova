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

exports.getStockPrice = async (req, res) => {
    const { symbol } = req.params;
    try {
        const result = await yahooFinance.quote(symbol);
        res.json({
            symbol: result.symbol,
            price: result.regularMarketPrice,
            currency: result.currency,
            time: result.regularMarketTime,
        });
    } catch (error) {
        console.error(`Failed to fetch price for ${symbol}:`, error.message);
        res.status(500).json({ error: 'Could not fetch stock price' });
    }
};

exports.getRandomStockPrices = async (req, res) => {
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

        res.json(results);
    } catch (err) {
        console.error('Failed to fetch stock prices:', err.message);
        res.status(500).json({ error: 'Stock data fetch failed' });
    }
};
exports.getStockHistory = async (req, res) => {
    const { symbol } = req.params;
    try {
        const result = await yahooFinance.historical(symbol, { period1: '2020-01-01', period2: '2023-01-01' });
        res.json(result);
    } catch (error) {
        console.error(`Failed to fetch history for ${symbol}:`, error.message);
        res.status(500).json({ error: 'Could not fetch stock history' });
    }
};