const express = require('express');
const router = express.Router();
const controller = require('../controllers/accountsController');

router.post('/', controller.createAccount);

module.exports = router;
