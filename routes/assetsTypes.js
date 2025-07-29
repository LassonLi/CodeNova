const express = require('express');
const router = express.Router();
const controller = require('../controllers/assetTypesController');

router.get('/', controller.listAssetTypes);
router.post('/', controller.createAssetType);

module.exports = router;
