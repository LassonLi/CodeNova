const assetModel = require('../models/assetModel');
const transactionsController = require('./transactionsController');

exports.updateAsset = async (req, res) => {
  const { asset_name } = req.params; // 从请求参数中获取资产名称
  let {
    account_id=1,
    asset_type,
    transaction_type,
    quantity = null,
    price_per_unit = null,
    transaction_amount,
    transaction_time = new Date(),
  } = req.body;

  // 验证必填字段
  if (!asset_name || !transaction_type || !transaction_amount) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }
    // 强制转换为浮点数并对齐小数位数
    transaction_amount = parseFloat(transaction_amount);
    quantity = quantity !== null ? parseFloat(quantity) : null;
    price_per_unit = price_per_unit !== null ? parseFloat(price_per_unit) : null;

  try {
    // 获取资产类型 ID
    const asset_type_id = await assetModel.getAssetsTypeIdByType(asset_type);

    // 检查资产是否存在
    const existingAsset = await assetModel.existAssetName(asset_name);

    let current_quantity, total_amount, average_price, purchase_price;
    purchase_price = price_per_unit; // 只有第一次buy的时候才使用 purchase_price

    if (existingAsset.length > 0) {
        // 如果资产存在，计算新的 current_quantity 和 total_amount
        const db_current_quantity = parseFloat(existingAsset[0].current_quantity || 0);
        const db_total_amount = parseFloat(existingAsset[0].total_amount || 0);

      if (quantity !== null) {
        if (transaction_type == 'buy' || transaction_type == 'deposit') {
          current_quantity = db_current_quantity + quantity;
          total_amount = db_total_amount + transaction_amount;
        } else {
          if (db_current_quantity < quantity) {
            return res.status(400).json({ error: 'Insufficient quantity for this sell or withdraw.' });
          }
          if (db_total_amount < transaction_amount) {
            return res.status(400).json({ error: 'Insufficient funds for this sell or withdraw.' });
          }
          current_quantity = db_current_quantity - quantity;
          total_amount = db_total_amount - transaction_amount;
        }
      } else {
        current_quantity = db_current_quantity;
        total_amount = db_total_amount;
      }

      // 计算平均价格
      average_price = current_quantity > 0 ? total_amount / current_quantity : null;

      // 调用 updateAsset 方法
      const updatedRows = await assetModel.updateAsset(
        existingAsset[0].asset_id,
        account_id,
        asset_type_id,
        current_quantity.toFixed(8), // 格式化为 8 位小数
        price_per_unit ? price_per_unit.toFixed(8) : null,
        average_price ? average_price.toFixed(8) : null,
        total_amount.toFixed(8), // 格式化为 8 位小数
        transaction_time
      );

      // 调用 createTransaction 方法记录交易
      await transactionsController.createTransaction({
        body: {
          asset_name,
          transaction_type,
          quantity,
          price_per_unit,
          transaction_amount,
          transaction_time,
        },
      }, {
        status: () => ({
          json: (data) => console.log('Transaction created:', data),
        }),
      });

      res.json({ action: 'updated', updatedRows });
    } else {
      // 如果资产不存在，插入新资产
      current_quantity = quantity;
      total_amount = transaction_amount;
      average_price = current_quantity > 0 ? total_amount / current_quantity : null;

      const insertedId = await assetModel.postAsset(
        asset_name,
        account_id,
        asset_type_id,
        current_quantity.toFixed(8), // 格式化为 8 位小数
        price_per_unit ? price_per_unit.toFixed(8) : null,
        purchase_price ? purchase_price.toFixed(8) : null,
        average_price ? average_price.toFixed(8) : null,
        total_amount.toFixed(8), // 格式化为 8 位小数
        transaction_time
      );
      // 调用 createTransaction 方法记录交易
      await transactionsController.createTransaction({
        body: {
          asset_name,
          transaction_type,
          quantity,
          price_per_unit,
          transaction_amount,
          transaction_time,
        },
      }, {
        status: () => ({
          json: (data) => console.log('Transaction created:', data),
        }),
      });
      res.json({ action: 'inserted', insertedId });
    }
  } catch (err) {
    console.error('Error updating or inserting asset:', err.message);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
};

exports.getAssetsByType = async (req, res) => {
  const { type_name } = req.params;

  try {
    // 调用模型方法获取资产
    const asset_type_id = await assetModel.getAssetsTypeIdByType(type_name);
    const assets = await assetModel.getAssetsByType(asset_type_id);

    // 返回资产列表
    
    res.json(assets);
  } catch (err) {
    console.error('Error fetching assets by account:', err.message);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
};

exports.createAsset = async (req, res) => {
  const {
    asset_name,
    account_id,
    asset_type,
    current_quantity = null,
    current_price_per_unit = null,
    total_amount = null,
    created_at = new Date(),
  } = req.body;

  // Validate required fields
  if (!asset_name || !account_id || !asset_type) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  try {
    // Get asset type ID
    const asset_type_id = await assetModel.getAssetsTypeIdByType(asset_type);

    // Insert the new asset
    const insertedId = await assetModel.postAsset(
      asset_name,
      account_id,
      asset_type_id,
      current_quantity,
      current_price_per_unit,
      current_price_per_unit, // purchase_price
      current_quantity && total_amount ? total_amount / current_quantity : null, // average_price
      total_amount,
      created_at
    );

    res.status(201).json({ assetId: insertedId });
  } catch (err) {
    console.error('Error creating asset:', err.message);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
};
