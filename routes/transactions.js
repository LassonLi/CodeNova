const express = require('express');
const router = express.Router();
const controller = require('../controllers/transactionsController');

router.post('/', controller.createTransaction);
router.get('/asset/:asset_id', controller.getTransactionsByAsset);

module.exports = router;
