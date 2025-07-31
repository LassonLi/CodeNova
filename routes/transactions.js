const express = require('express');
const router = express.Router();
const controller = require('../controllers/transactionsController');

/**
 * @swagger
 * /transactions:
 *   post:
 *     summary: Create a new transaction
 *     tags: [Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               asset_name:
 *                 type: string
 *               transaction_type:
 *                 type: string
 *               quantity:
 *                 type: number
 *               price_per_unit:
 *                 type: number
 *               transaction_amount:
 *                 type: number
 *     responses:
 *       201:
 *         description: Transaction created successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 */
router.post('/', controller.createTransaction);

/**
 * @swagger
 * /transactions/{asset_id}:
 *   get:
 *     summary: Get transactions by asset ID
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: asset_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the asset
 *     responses:
 *       200:
 *         description: List of transactions
 *       400:
 *         description: Missing required field
 *       500:
 *         description: Internal server error
 */
router.get('/:asset_id', controller.getTransactionsByAsset);

/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Get all transactions
 *     tags: [Transactions]
 *     responses:
 *       200:
 *         description: List of transactions
 *       500:
 *         description: Internal server error
 */
router.get('/', controller.getTransactions);

module.exports = router;
