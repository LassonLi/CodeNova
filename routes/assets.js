const express = require('express');
const router = express.Router();
const controller = require('../controllers/assetsController');

/**
 * @swagger
 * /assets:
 *   post:
 *     summary: Create a new asset
 *     tags: [Assets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               asset_name:
 *                 type: string
 *               account_id:
 *                 type: integer
 *               asset_type:
 *                 type: string
 *               current_quantity:
 *                 type: number
 *               current_price_per_unit:
 *                 type: number
 *               total_amount:
 *                 type: number
 *     responses:
 *       201:
 *         description: Asset created successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 */
router.post('/', controller.createAsset); // Ensure createAsset is correctly defined

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
 *         description: The type of the asset (e.g., stock, bond)
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

router.put('/:asset_name', controller.updateAsset);

module.exports = router;
