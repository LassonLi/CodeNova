const yahooFinance = require('yahoo-finance2').default;

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
