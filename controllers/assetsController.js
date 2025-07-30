const assetModel = require('../models/assetModel');


exports.updateAsset = async (req, res) => {
  const { asset_name } = req.params; // 从请求参数中获取资产名称
  const {account_id, 
    asset_type_id, 
    current_quantity=null,
    current_price_per_unit=null, 
    purchase_price=null, 
    average_price=null, 
    total_amount=null, 
    created_at=null, 
    updated_at=null} = req.body;
  const assetData = req.body; // 从请求体中获取资产数据

  try {
    // 检查资产是否存在
    const existingAsset = await assetModel.existAssetName(asset_name);

    if (existingAsset.length > 0) {
      // 如果资产存在，调用 updateAsset 方法
      const updatedRows = await assetModel.updateAsset(existingAsset[0].asset_id, assetData);
      res.json({ action: 'updated', updatedRows });
    } else {
      // 如果资产不存在，调用 postAsset 方法
      const insertedId = await assetModel.postAsset(asset_name, assetData);
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
