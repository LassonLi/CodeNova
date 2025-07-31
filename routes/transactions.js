const express = require('express');
const router = express.Router();
const controller = require('../controllers/transactionsController');

/**
 * @swagger
 * /transactions:
 *   post:
 *     summary: Create a new transaction
 *     description: Creates a new transaction for a specific asset.
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
 *                 description: The name of the asset involved in the transaction.
 *               transaction_type:
 *                 type: string
 *                 description: The type of transaction (e.g., buy, sell, deposit, withdraw).
 *               quantity:
 *                 type: number
 *                 description: The quantity of the asset involved in the transaction.
 *               price_per_unit:
 *                 type: number
 *                 description: The price per unit of the asset.
 *               transaction_amount:
 *                 type: number
 *                 description: The total transaction amount.
 *               transaction_time:
 *                 type: string
 *                 format: date-time
 *                 description: The time of the transaction (default is the current time).
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
 *     description: Fetches all transactions associated with a specific asset ID.
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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   Date:
 *                     type: string
 *                     format: date-time
 *                     description: The date and time of the transaction.
 *                   Asset name:
 *                     type: string
 *                     description: The type of the asset (e.g., stock, bond).
 *                   Type:
 *                     type: string
 *                     description: The specific asset type (e.g., AAPL, TSLA).
 *                   Amount:
 *                     type: string
 *                     description: The total amount involved in the transaction.
 *                   operation:
 *                     type: string
 *                     description: The operation performed (e.g., buy, sell).
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
 *     description: Fetches the most recent transactions, limited to 15.
 *     tags: [Transactions]
 *     responses:
 *       200:
 *         description: List of transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   Date:
 *                     type: string
 *                     format: date-time
 *                     description: The date and time of the transaction.
 *                   Asset name:
 *                     type: string
 *                     description: The type of the asset (e.g., stock, bond).
 *                   Type:
 *                     type: string
 *                     description: The specific asset type (e.g., AAPL, TSLA).
 *                   Amount:
 *                     type: string
 *                     description: The total amount involved in the transaction.
 *                   operation:
 *                     type: string
 *                     description: The operation performed (e.g., buy, sell).
 *       500:
 *         description: Internal server error
 */
router.get('/', controller.getTransactions);

module.exports = router;
