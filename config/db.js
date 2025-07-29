const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'n3u3da!',
  database: 'properties',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
async function Connection() {
    try {
      const conn = await pool.getConnection();
      console.log(`Connected to database "${pool.options.database}"...`);
      conn.release();
    } catch (err) {
      console.error('Database connection failed:', err);
    }
}
  
module.exports = {pool, Connection};


// async function buyAsset(accountId, assetName, assetTypeId, quantity, pricePerUnit) {
//     const conn = await pool.getConnection();
//     try {
//       await conn.beginTransaction();
  
//       // Check if asset exists
//       const [assets] = await conn.query(
//         `SELECT * FROM assets WHERE account_id = ? AND asset_name = ?`,
//         [accountId, assetName]
//       );
  
//       let assetId;
//       if (assets.length === 0) {
//         // Insert new asset
//         const [result] = await conn.query(
//           `INSERT INTO assets (account_id, asset_type_id, asset_name, current_quantity, purchase_price, average_price, total_amount)
//            VALUES (?, ?, ?, ?, ?, ?, ?)`,
//           [accountId, assetTypeId, assetName, quantity, pricePerUnit, pricePerUnit, quantity * pricePerUnit]
//         );
//         assetId = result.insertId;
//       } else {
//         // Update existing asset quantity and average price
//         const asset = assets[0];
//         const newQuantity = asset.current_quantity + quantity;
//         const newTotalAmount = (asset.average_price * asset.current_quantity) + (pricePerUnit * quantity);
//         const newAveragePrice = newTotalAmount / newQuantity;
  
//         await conn.query(
//           `UPDATE assets SET current_quantity = ?, average_price = ?, total_amount = ? WHERE asset_id = ?`,
//           [newQuantity, newAveragePrice, newQuantity * newAveragePrice, asset.asset_id]
//         );
//         assetId = asset.asset_id;
//       }
  
//       // Insert transaction
//       await conn.query(
//         `INSERT INTO transactions (asset_id, transaction_type_id, quantity, price_per_unit, transaction_amount)
//          VALUES (?, (SELECT transaction_type_id FROM transaction_types WHERE type_name = 'buy'), ?, ?, ?)`,
//         [assetId, quantity, pricePerUnit, quantity * pricePerUnit]
//       );
  
//       await conn.commit();
//       return { success: true, assetId };
//     } catch (err) {
//       await conn.rollback();
//       throw err;
//     } finally {
//       conn.release();
//     }
// }

// async function sellAsset(accountId, assetName, quantity, pricePerUnit) {
//     const conn = await pool.getConnection();
//     try {
//       await conn.beginTransaction();
  
//       // Get asset
//       const [assets] = await conn.query(
//         `SELECT * FROM assets WHERE account_id = ? AND asset_name = ?`,
//         [accountId, assetName]
//       );
//       if (assets.length === 0) throw new Error('Asset not found');
//       const asset = assets[0];
//       if (asset.current_quantity < quantity) throw new Error('Not enough quantity to sell');
  
//       const newQuantity = asset.current_quantity - quantity;
  
//       await conn.query(
//         `UPDATE assets SET current_quantity = ?, total_amount = ? WHERE asset_id = ?`,
//         [newQuantity, newQuantity * asset.average_price, asset.asset_id]
//       );
  
//       // Insert transaction
//       await conn.query(
//         `INSERT INTO transactions (asset_id, transaction_type_id, quantity, price_per_unit, transaction_amount)
//          VALUES (?, (SELECT transaction_type_id FROM transaction_types WHERE type_name = 'sell'), ?, ?, ?)`,
//         [asset.asset_id, quantity, pricePerUnit, quantity * pricePerUnit]
//       );
  
//       await conn.commit();
//       return { success: true };
//     } catch (err) {
//       await conn.rollback();
//       throw err;
//     } finally {
//       conn.release();
//     }
// }

// async function getTransactionHistory(accountId) {
//     const conn = await pool.getConnection();
//     try {
//       const [rows] = await conn.query(
//         `SELECT t.transaction_id, a.asset_name, tt.type_name AS transaction_type, t.quantity, t.price_per_unit, t.transaction_amount, t.transaction_time
//          FROM transactions t
//          JOIN assets a ON t.asset_id = a.asset_id
//          JOIN transaction_types tt ON t.transaction_type_id = tt.transaction_type_id
//          WHERE a.account_id = ?
//          ORDER BY t.transaction_time DESC`,
//         [accountId]
//       );
//       return rows;
//     } finally {
//       conn.release();
//     }
// }

// async function getPortfolioSummary(accountId) {
//     const conn = await pool.getConnection();
//     try {
//       const [rows] = await conn.query(
//         `SELECT asset_name, current_quantity, average_price, current_price_per_unit,
//           current_quantity * current_price_per_unit AS current_value,
//           current_quantity * average_price AS invested_amount,
//           (current_quantity * current_price_per_unit) - (current_quantity * average_price) AS gain_loss
//          FROM assets
//          WHERE account_id = ?`,
//         [accountId]
//       );
  
//       // Optionally, sum totals
//       const totalInvested = rows.reduce((sum, r) => sum + r.invested_amount, 0);
//       const totalCurrentValue = rows.reduce((sum, r) => sum + r.current_value, 0);
//       const totalGainLoss = totalCurrentValue - totalInvested;
  
//       return { assets: rows, totalInvested, totalCurrentValue, totalGainLoss };
//     } finally {
//       conn.release();
//     }
// }

// async function getPriceTrend(accountId, assetName) {
//     const conn = await pool.getConnection();
//     try {
//       const [rows] = await conn.query(
//         `SELECT t.transaction_time, t.price_per_unit, tt.type_name AS transaction_type
//          FROM transactions t
//          JOIN assets a ON t.asset_id = a.asset_id
//          JOIN transaction_types tt ON t.transaction_type_id = tt.transaction_type_id
//          WHERE a.account_id = ? AND a.asset_name = ?
//          ORDER BY t.transaction_time`,
//         [accountId, assetName]
//       );
//       return rows;
//     } finally {
//       conn.release();
//     }
// }
  
  
  

