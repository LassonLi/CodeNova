const express = require('express');
const router = express.Router();
const controller = require('../controllers/transactionTypesController');

router.get('/', controller.listTransactionTypes);
router.post('/', controller.createTransactionType);

module.exports = router;
