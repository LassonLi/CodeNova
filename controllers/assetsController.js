const assetModel = require('../models/assetModel');
const transactionsController = require('./transactionsController');
const yahooApiController = require('./yahooApiController');


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
    // 获取资产类型 ID
    const asset_type_id = await assetModel.getAssetsTypeIdByType(type_name);

    if (!asset_type_id) {
      return res.status(404).json({ error: `Asset type "${type_name}" not found.` });
    }

    // 获取资产列表
    const assets = await assetModel.getAssetsByType(asset_type_id);

    // 调用 Yahoo API 获取当前价格并计算利率
    const enrichedAssets = await Promise.all(
      assets.map(async (asset) => {
        try {
          // 模拟调用 yahooApiController.getStockPrice 方法
          const mockReq = { params: { symbol: asset.asset_name } };
          let yahooResponseData;

          // 模拟 res 对象
          const mockRes = {
            json: (data) => {
              yahooResponseData = data; // 捕获返回的 JSON 数据
            },
            status: (statusCode) => ({
              json: (data) => {
                throw new Error(`Failed to fetch price for ${asset.asset_name}: ${data.error}`);
              },
            }),
          };

          // 调用 yahooApiController.getStockPrice
          await yahooApiController.getStockPrice(mockReq, mockRes);

          // 从响应中提取价格
          const current_price_per_unit = yahooResponseData.price;

          // 计算利率 interest_rate
          const interest_rate = asset.total_amount
            ? ((asset.current_quantity * current_price_per_unit - asset.total_amount) / asset.total_amount).toFixed(8)
            : null;

          return {
            ...asset,
            current_price_per_unit: current_price_per_unit.toFixed(8),
            interest_rate,
          };
        } catch (error) {
          console.error(`Failed to fetch price for ${asset.asset_name}:`, error.message);
          return {
            ...asset,
            current_price_per_unit: null,
            interest_rate: null,
          };
        }
      })
    );

    res.json(enrichedAssets);
  } catch (err) {
    console.error('Error fetching assets by type:', err.message);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
};

// exports.getAssetsByType = async (req, res) => {
//   const { type_name } = req.params;
// // 返回的字段
// // asset_name varchar(100) 
// // current_quantity decimal(20,8) 
// // current_price_per_unit decimal(20,8)  // 希望是调用yahooApiController
// // purchase_price decimal(20,8) 
// // average_price decimal(20,8) 
// // total_amount decimal(20,8) 
// // created_at timestamp 
// // updated_at timestamp
// // interest_rate float()  = （current_quantity * current_price_per_unit - total_amount）// total_amount

//   try {
//     // 调用模型方法获取资产
//     const asset_type_id = await assetModel.getAssetsTypeIdByType(type_name);
//     const assets = await assetModel.getAssetsByType(asset_type_id);

//     // 返回资产列表
    
//     res.json(assets);
//   } catch (err) {
//     console.error('Error fetching assets by account:', err.message);
//     res.status(500).json({ error: 'An internal server error occurred.' });
//   }
// };

// const {pool} = require('../config/db');

// exports.updateAsset = (req, res) => {
//   const { asset_id } = req.params;
//   pool.query('UPDATE assets SET ? WHERE asset_id = ?', [req.body, asset_id], (err, result) => {
//         if (err) {
//       console.error('Database query error:', err.message);
//       return res.status(500).json({ error: 'An internal server error occurred.' });
//     }
//     res.json({ updated: result.affectedRows });
//   });
// };

// exports.getAssetsByType = async (req, res) => {
//   const { account_id } = req.params;
//   let connection;
//   try {
//     // 获取数据库连接
//     connection = await pool.getConnection();
//     const [results] = await connection.query('SELECT * FROM assets WHERE account_id = ?', [account_id]);
//     res.json(results);
//   } catch (err) {
//     console.error('Database query error in getAssetsByAccount:', err.message);
//     res.status(500).json({ error: 'An internal server error occurred.' });
//   } finally {
//     // 确保连接被释放
//     if (connection) connection.release();
//   }
// };
// exports.createAsset = async (req, res) => {
//   // const data = req.body;
//   const {
//     account_id,
//     asset_type_id,
//     asset_name,
//     current_quantity = null,
//     current_price_per_unit = null,
//     purchase_price = null,
//     average_price = null,
//     total_amount = null,
//     created_at = null,
//     updated_at = null,
//   } = req.body;
//   let connection;
//   try {
//     // 获取数据库连接
//     connection = await pool.getConnection();
//     // 插入数据
//     const [result] = await connection.query(
//       `INSERT INTO assets 
//       (account_id, asset_type_id, asset_name, current_quantity, current_price_per_unit, purchase_price, average_price, total_amount, created_at) 
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//       [
//         account_id,
//         asset_type_id,
//         asset_name,
//         current_quantity,
//         current_price_per_unit,
//         purchase_price,
//         average_price,
//         total_amount,
//         created_at,
//         updated_at
//       ]
//     );
//     res.status(201).json({ assetId: result.insertId });
//   } catch (err) {
//     console.error('Error creating asset:', err.message);
//     res.status(500).json({ error: 'An internal server error occurred' });
//   } finally {
//     // 确保连接被释放
//     if (connection) connection.release();
//   }
// };

// exports.getAssetsByAccount = async (req, res) => {
//   const { account_id } = req.params;
//   let connection;
//   try {
//     // 获取数据库连接
//     connection = await pool.getConnection();
//     const [results] = await connection.query('SELECT * FROM assets WHERE account_id = ?', [account_id]);
//     res.json(results);
//   } catch (err) {
//     console.error('Database query error in getAssetsByAccount:', err.message);
//     res.status(500).json({ error: 'An internal server error occurred.' });
//   } finally {
//     // 确保连接被释放
//     if (connection) connection.release();
//   }
// };

// exports.updateAsset = async (req, res) => {
//   const { asset_id } = req.params;
//   let connection;
//   try {
//     // 获取数据库连接
//     connection = await pool.getConnection();
//     const [result] = await connection.query('UPDATE assets SET ? WHERE asset_id = ?', [req.body, asset_id]);
//     res.json({ updated: result.affectedRows });
//   } catch (err) {
//     console.error('Database query error in updateAsset:', err.message);
//     res.status(500).json({ error: 'An internal server error occurred.' });
//   } finally {
//     // 确保连接被释放
//     if (connection) connection.release();
//   }
// };

// exports.deleteAsset = async (req, res) => {
//   const { asset_id } = req.params;
//   let connection;
//   try {
//     // 获取数据库连接
//     connection = await pool.getConnection();
//     const [result] = await connection.query('DELETE FROM assets WHERE asset_id = ?', [asset_id]);
//     res.json({ deleted: result.affectedRows });
//   } catch (err) {
//     console.error('Database query error in deleteAsset:', err.message);
//     res.status(500).json({ error: 'An internal server error occurred.' });
//   } finally {
//     // 确保连接被释放
//     if (connection) connection.release();
//   }
// };

// // exports.createAsset = (req, res) => {
// //   const data = req.body;
// //   pool.query('INSERT INTO assets SET ?', data, (err, result) => {
// //         if (err) {
// //           console.error('Error creating asset:', err.message);
// //           return res.status(500).json({ error: 'An internal server error occurred' });
// //         }
// //     res.status(201).json({ assetId: result.insertId });
// //   });
// // };

// // exports.getAssetsByAccount = (req, res) => {
// //   const { account_id } = req.params;
// //   pool.query('SELECT * FROM assets WHERE account_id = ?', [account_id], (err, results) => {
// //         if (err) {
// //           console.error('Database query error:', err.message);
// //           return res.status(500).json({ error: 'An internal server error occurred.' });
// //         }
// //     res.json(results);
// //   });
// // };

// exports.updateAsset = (req, res) => {
//   const { asset_id } = req.params;
//   pool.query('UPDATE assets SET ? WHERE asset_id = ?', [req.body, asset_id], (err, result) => {
//         if (err) {
//       console.error('Database query error:', err.message);
//       return res.status(500).json({ error: 'An internal server error occurred.' });
//     }
//     res.json({ updated: result.affectedRows });
//   });
// };

// // exports.deleteAsset = (req, res) => {
// //   const { asset_id } = req.params;
// //   pool.query('DELETE FROM assets WHERE asset_id = ?', [asset_id], (err, result) => {
// //         if (err) {
// //       console.error('Database query error:', err.message);
// //       return res.status(500).json({ error: 'An internal server error occurred.' });
// //     }
// //     res.json({ deleted: result.affectedRows });
// //   });
// // };
