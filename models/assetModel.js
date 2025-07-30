const {pool} = require('../config/db');

// 更新资产
exports.updateAsset = async (
  assetId,
  account_id,
  asset_type_id,
  current_quantity,
  current_price_per_unit,
  purchase_price,
  average_price,
  total_amount,
  updated_at
) => {
  const conn = await pool.getConnection();
  try {
    const [result] = await conn.query(
      `UPDATE assets 
       SET account_id = ?, 
           asset_type_id = ?, 
           current_quantity = ?, 
           current_price_per_unit = ?, 
           purchase_price = ?, 
           average_price = ?, 
           total_amount = ?, 
           updated_at = ? 
       WHERE asset_id = ?`,
      [
        account_id,
        asset_type_id,
        current_quantity,
        current_price_per_unit,
        purchase_price,
        average_price,
        total_amount,
        updated_at,
        assetId,
      ]
    );
    return result.affectedRows; // 返回受影响的行数
  } catch (err) {
    console.error('Error in updateAsset:', err.message);
    throw err;
  } finally {
    conn.release();
  }
};

// 查找该资产名是否存在
exports.existAssetName = async (asset_name) => {
  const conn = await pool.getConnection();
  try {
    const [results] = await conn.query('SELECT * FROM assets WHERE asset_name = ?', [asset_name]);
    return results; // 返回查询结果
  } catch (err) {
    console.error('Error in existAssetName:', err.message);
    throw err;
  } finally {
    conn.release();
  }
};

// 
exports.postAsset = async (
  asset_name,
  account_id,
  asset_type_id,
  current_quantity,
  current_price_per_unit,
  purchase_price,
  average_price,
  total_amount,
  created_at
) => {
  const conn = await pool.getConnection();
  try {
    const [result] = await conn.query(
      `INSERT INTO assets 
       (asset_name, account_id, asset_type_id, current_quantity, current_price_per_unit, purchase_price, average_price, total_amount, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        asset_name,
        account_id,
        asset_type_id,
        current_quantity,
        current_price_per_unit,
        purchase_price,
        average_price,
        total_amount,
        created_at,
      ]
    );
    return result.insertId; // 返回插入的资产 ID
  } catch (err) {
    console.error('Error in postAsset:', err.message);
    throw err;
  } finally {
    conn.release();
  }
};

// 根据账户 ID 获取资产
exports.getAssetsByType = async (accountId) => {
  const conn = await pool.getConnection();
  try {
    const [results] = await conn.query('SELECT * FROM assets WHERE account_id = ?', [accountId]);
    return results; // 返回查询结果
  } catch (err) {
    console.error('Error in getAssetsByAccount:', err.message);
    throw err;
  } finally {
    conn.release();
  }
};

// 根据账户 asset_type_id 获取type_name
exports.getAssetsTypeIdByType = async (typeName) => {
  const conn = await pool.getConnection();
  try {
    // 查询 asset_types 表以获取 asset_type_id
    const [results] = await conn.query(
      'SELECT asset_type_id FROM asset_types WHERE type_name = ?',
      [typeName]
    );

    if (results.length === 0) {
      throw new Error(`Asset type "${typeName}" not found.`);
    }

    return results[0].asset_type_id; // 返回 asset_type_id
  } catch (err) {
    console.error('Error in getAssetsTypeIdByType:', err.message);
    throw err;
  } finally {
    conn.release();
  }
};


// exports.buyAsset = async (accountId, assetName, assetTypeId, quantity, pricePerUnit) => {
//   const conn = await pool.getConnection();
//   try {
//     await conn.beginTransaction();
//     const [assets] = await conn.query(
//       'SELECT * FROM assets WHERE account_id = ? AND asset_name = ?',
//       [accountId, assetName]
//     );

//     let assetId;
//     if (assets.length === 0) {
//       const [result] = await conn.query(
//         `INSERT INTO assets (account_id, asset_type_id, asset_name, current_quantity, purchase_price, average_price, total_amount)
//          VALUES (?, ?, ?, ?, ?, ?, ?)`,
//         [accountId, assetTypeId, assetName, quantity, pricePerUnit, pricePerUnit, quantity * pricePerUnit]
//       );
//       assetId = result.insertId;
//     } else {
//       const asset = assets[0];
//       const newQuantity = asset.current_quantity + quantity;
//       const newTotalAmount = (asset.average_price * asset.current_quantity) + (pricePerUnit * quantity);
//       const newAveragePrice = newTotalAmount / newQuantity;

//       await conn.query(
//         `UPDATE assets SET current_quantity = ?, average_price = ?, total_amount = ? WHERE asset_id = ?`,
//         [newQuantity, newAveragePrice, newQuantity * newAveragePrice, asset.asset_id]
//       );
//       assetId = asset.asset_id;
//     }

//     await conn.query(
//       `INSERT INTO transactions (asset_id, transaction_type_id, quantity, price_per_unit, transaction_amount)
//        VALUES (?, (SELECT transaction_type_id FROM transaction_types WHERE type_name = 'buy'), ?, ?, ?)`,
//       [assetId, quantity, pricePerUnit, quantity * pricePerUnit]
//     );

//     await conn.commit();
//     return { success: true, assetId };
//   } catch (err) {
//     await conn.rollback();
//     throw err;
//   } finally {
//     conn.release();
//   }
// };

// exports.sellAsset = async (accountId, assetName, quantity, pricePerUnit) => {
//   const conn = await pool.getConnection();
//   try {
//     await conn.beginTransaction();

//     const [assets] = await conn.query(
//       `SELECT * FROM assets WHERE account_id = ? AND asset_name = ?`,
//       [accountId, assetName]
//     );
//     if (assets.length === 0) throw new Error('Asset not found');
//     const asset = assets[0];
//     if (asset.current_quantity < quantity) throw new Error('Not enough quantity to sell');

//     const newQuantity = asset.current_quantity - quantity;

//     await conn.query(
//       `UPDATE assets SET current_quantity = ?, total_amount = ? WHERE asset_id = ?`,
//       [newQuantity, newQuantity * asset.average_price, asset.asset_id]
//     );

//     await conn.query(
//       `INSERT INTO transactions (asset_id, transaction_type_id, quantity, price_per_unit, transaction_amount)
//        VALUES (?, (SELECT transaction_type_id FROM transaction_types WHERE type_name = 'sell'), ?, ?, ?)`,
//       [asset.asset_id, quantity, pricePerUnit, quantity * pricePerUnit]
//     );

//     await conn.commit();
//     return { success: true };
//   } catch (err) {
//     await conn.rollback();
//     throw err;
//   } finally {
//     conn.release();
//   }
// };
