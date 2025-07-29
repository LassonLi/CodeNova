const express = require('express');
const router = express.Router();
const controller = require('../controllers/assetsController');

router.post('/', controller.createAsset);
router.get('/account/:account_id', controller.getAssetsByAccount);
router.put('/:asset_id', controller.updateAsset);
router.delete('/:asset_id', controller.deleteAsset);

module.exports = router;
