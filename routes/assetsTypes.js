const express = require('express');
const router = express.Router();
const controller = require('../controllers/assetsTypesController');

router.get('/', controller.listAssetTypes);
router.post('/', controller.createAssetType);

module.exports = router;
