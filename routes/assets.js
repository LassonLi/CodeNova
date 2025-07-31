const express = require('express');
const router = express.Router();
const controller = require('../controllers/assetsController');

/**
 * @swagger
 * /assets/type/{type_name}:
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
 *                     description: The name of the asset
 *                   current_quantity:
 *                     type: string
 *                     description: The current quantity of the asset
 *                   current_price_per_unit:
 *                     type: string
 *                     description: The current price per unit of the asset
 *                   purchase_price:
 *                     type: string
 *                     description: The purchase price of the asset
 *                   average_price:
 *                     type: string
 *                     description: The average price of the asset
 *                   total_amount:
 *                     type: string
 *                     description: The total amount of the asset
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     description: The creation timestamp of the asset
 *                   updated_at:
 *                     type: string
 *                     format: date-time
 *                     description: The last update timestamp of the asset
 *                   asset_type_name:
 *                     type: string
 *                     description: The type name of the asset (e.g., stock, cash)
 *                   interest_rate:
 *                     type: string
 *                     description: The interest rate of the asset
 *       400:
 *         description: Invalid asset type
 *       500:
 *         description: Internal server error
 */
router.get('/type/:type_name', controller.getAssetsByType);

/**
 * @swagger
 * /assets/{asset_name}:
 *   put:
 *     summary: Update an asset and add a transaction by buying, selling, depositing, or withdrawing.
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
 *                 nullable: true
 *                 description: The quantity of the asset involved in the transaction (nullable for cash transactions).
 *               price_per_unit:
 *                 type: number
 *                 nullable: true
 *                 description: The price per unit of the asset (nullable for cash transactions).
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 asset_type:
 *                   type: string
 *                   description: The type of the asset (e.g., stock, cash).
 *                 transaction_type:
 *                   type: string
 *                   description: The type of transaction (e.g., deposit, withdraw).
 *                 quantity:
 *                   type: number
 *                   description: The quantity of the asset involved in the transaction.
 *                 price_per_unit:
 *                   type: number
 *                   description: The price per unit of the asset.
 *                 transaction_amount:
 *                   type: number
 *                   description: The total transaction amount.
 *       400:
 *         description: Missing required fields or invalid data
 *       500:
 *         description: Internal server error
 */
router.put('/:asset_name', controller.updateAsset);

/**
 * @swagger
 * /assets/{asset_name}:
 *   get:
 *     summary: Get asset details by name
 *     tags: [Assets]
 *     parameters:
 *       - in: path
 *         name: asset_name
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the asset to retrieve
 *     responses:
 *       200:
 *         description: Asset details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 asset_name:
 *                   type: string
 *                   description: The name of the asset
 *                 current_quantity:
 *                   type: string
 *                   description: The current quantity of the asset
 *                 current_price_per_unit:
 *                   type: number
 *                   nullable: true
 *                   description: The current price per unit of the asset (nullable if unavailable)
 *                 purchase_price:
 *                   type: string
 *                   description: The purchase price of the asset
 *                 average_price:
 *                   type: string
 *                   description: The average price of the asset
 *                 total_amount:
 *                   type: string
 *                   description: The total amount of the asset
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   description: The creation timestamp of the asset
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *                   description: The last update timestamp of the asset
 *                 asset_type_name:
 *                   type: string
 *                   description: The type name of the asset (e.g., cash, stock)
 *                 interest_rate:
 *                   type: string
 *                   description: The interest rate of the asset
 *       404:
 *         description: Asset not found
 *       500:
 *         description: Internal server error
 */
router.get('/:asset_name', controller.getAssetsByName);

module.exports = router;
