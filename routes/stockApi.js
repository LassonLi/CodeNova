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
 *                 price:
 *                   type: number
 *       400:
 *         description: Invalid stock symbol
 *       500:
 *         description: Internal server error
 */
router.get('/price/:symbol', stockController.getStockPrice);

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
 *                   price:
 *                     type: number
 *       400:
 *         description: Invalid stock symbol
 *       500:
 *         description: Internal server error
 */
router.get('/history/:symbol', stockController.getStockHistory);

router.get('/price/', stockController.getRandomStockPrices);

module.exports = router;
