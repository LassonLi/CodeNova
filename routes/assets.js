const express = require('express');
const router = express.Router();
const controller = require('../controllers/assetsController');

// router.post('/', controller.createAsset);
router.get('/type/:type_name', controller.getAssetsByType); //  ('stock'), ('bonds'), ('cash'), ('others');
router.put('/:asset_name', controller.updateAsset);
// router.delete('/:asset_id', controller.deleteAsset);

module.exports = router;
