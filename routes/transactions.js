const express = require('express');
const router = express.Router();
const controller = require('../controllers/transactionsController');

router.post('/', controller.createTransaction);
router.get('/:asset_id', controller.getTransactionsByAsset);
router.get('/', controller.getTransactions);


module.exports = router;
