const express = require('express');
const router = express.Router();
const controller = require('../controllers/assetsController');

/**
 * @swagger
 * /assets/{type_name}:
 *   get:
 *     summary: Get assets by type
 *     tags: [Assets]
 *     parameters:
 *       - in: path
 *         name: type_name
 *         required: true
 *         schema:
 *           type: string
 *         description: The type of the asset (e.g., stock, cash)
 *     responses:
 *       200:
 *         description: List of assets by type
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   asset_name:
 *                     type: string
 *                   current_quantity:
 *                     type: number
 *                   total_amount:
 *                     type: number
 *       400:
 *         description: Invalid asset type
 *       500:
 *         description: Internal server error
 */
router.get('/:type_name', controller.getAssetsByType);

/**
 * @swagger
 * /assets/{asset_name}:
 *   put:
 *     summary: Update an asset and add trasaction by buying or selling.
 *     tags: [Assets]
 *     parameters:
 *       - in: path
 *         name: asset_name
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the asset to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               account_id:
 *                 type: integer
 *                 description: The account ID (default is 1).
 *               asset_type:
 *                 type: string
 *                 description: The type of the asset (e.g., stock, cash).
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
 *       200:
 *         description: Asset updated successfully
 *       400:
 *         description: Missing required fields or invalid data
 *       500:
 *         description: Internal server error
 */
router.put('/:asset_name', controller.updateAsset);

module.exports = router;
