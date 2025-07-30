const express = require('express');
const router = express.Router();
const controller = require('../controllers/transactionsController');

router.post('/', controller.createTransaction);
// router.get('/asset/:asset_id', controller.getTransactionsByAsset);
router.get('/:asset_id', controller.getTransaction); // Get transactions by asset_id
router.get('/', controller.getTransactions); // Get transactions(1)
router.get('/history', controller.getTransactionsHistory);


module.exports = router;
