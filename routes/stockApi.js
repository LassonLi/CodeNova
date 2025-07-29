const express = require('express');
const router = express.Router();
const stockController = require('../controllers/yahooApiController');

router.get('/history/:symbol', stockController.getStockHistory);
router.get('/price/:symbol', stockController.getStockPrice);
router.get('/price/', stockController.getRandomStockPrices);

module.exports = router;
