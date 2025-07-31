const express = require('express');
const router = express.Router();
const stockController = require('../controllers/yahooApiController');

/**
 * @swagger
 * /stockApi/price/{symbol}:
 *   get:
 *     summary: Get the current stock price for a given symbol
 *     tags: [Stock API]
 *     parameters:
 *       - in: path
 *         name: symbol
 *         required: true
 *         schema:
 *           type: string
 *         description: The stock symbol (e.g., AAPL, TSLA)
 *     responses:
 *       200:
 *         description: Current stock price
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 symbol:
 *                   type: string
 *                   description: The stock symbol
 *                 price:
 *                   type: number
 *                   description: The current stock price
 *                 currency:
 *                   type: string
 *                   description: The currency of the stock price
 *                 time:
 *                   type: string
 *                   format: date-time
 *                   description: The time of the stock price
 *       400:
 *         description: Invalid stock symbol
 *       500:
 *         description: Internal server error
 */
router.get('/price/:symbol', stockController.getStockPrice);

/**
 * @swagger
 * /stockApi/price:
 *   get:
 *     summary: Get random stock prices
 *     tags: [Stock API]
 *     responses:
 *       200:
 *         description: List of random stock prices
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   symbol:
 *                     type: string
 *                     description: The stock symbol
 *                   price:
 *                     type: number
 *                     description: The current stock price
 *                   change:
 *                     type: number
 *                     description: The change in stock price
 *                   percentChange:
 *                     type: number
 *                     description: The percentage change in stock price
 *                   currency:
 *                     type: string
 *                     description: The currency of the stock price
 *       500:
 *         description: Internal server error
 */
router.get('/price/', stockController.getRandomStockPrices);

/**
 * @swagger
 * /stockApi/history/{symbol}:
 *   get:
 *     summary: Get the historical stock prices for a given symbol
 *     tags: [Stock API]
 *     parameters:
 *       - in: path
 *         name: symbol
 *         required: true
 *         schema:
 *           type: string
 *         description: The stock symbol (e.g., AAPL, TSLA)
 *     responses:
 *       200:
 *         description: Historical stock prices
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   date:
 *                     type: string
 *                     format: date-time
 *                     description: The date of the stock price
 *                   high:
 *                     type: number
 *                     description: The highest price of the stock on that date
 *                   volume:
 *                     type: integer
 *                     description: The trading volume of the stock on that date
 *                   open:
 *                     type: number
 *                     description: The opening price of the stock on that date
 *                   low:
 *                     type: number
 *                     description: The lowest price of the stock on that date
 *                   close:
 *                     type: number
 *                     description: The closing price of the stock on that date
 *                   adjClose:
 *                     type: number
 *                     description: The adjusted closing price of the stock on that date
 *       400:
 *         description: Invalid stock symbol
 *       500:
 *         description: Internal server error
 */
router.get('/history/:symbol', stockController.getStockHistory);

module.exports = router;
