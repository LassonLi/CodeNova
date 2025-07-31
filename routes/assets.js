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
 * /assets:
 *   put:
 *     summary: Buy or sell an asset.
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
 *               asset_type:
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
 *       200:
 *         description: Asset updated successfully
 *       400:
 *         description: Missing required fields or invalid data
 *       500:
 *         description: Internal server error
 */
router.put('/:asset_name', controller.updateAsset);

module.exports = router;
