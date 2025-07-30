const {pool} = require('../config/db');

//getTransactions(15)
exports.getTransactions = async (limit) => {
  const query = 'SELECT * FROM transactions LIMIT ?';
  const [rows] = await db.execute(query, [limit]);
  return rows;
};

exports.getTransactionHistory = async () => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      `SELECT t.transaction_id, a.asset_name, tt.type_name AS transaction_type, t.quantity, t.price_per_unit, t.transaction_amount, t.transaction_time
       FROM transactions t
       JOIN assets a ON t.asset_id = a.asset_id
       JOIN transaction_types tt ON t.transaction_type_id = tt.transaction_type_id
       ORDER BY t.transaction_time DESC`,
    );
    return rows;
  } finally {
    conn.release();
  }
};

exports.getPriceTrend = async (accountId, assetName) => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      `SELECT t.transaction_time, t.price_per_unit, tt.type_name AS transaction_type
       FROM transactions t
       JOIN assets a ON t.asset_id = a.asset_id
       JOIN transaction_types tt ON t.transaction_type_id = tt.transaction_type_id
       WHERE a.account_id = ? AND a.asset_name = ?
       ORDER BY t.transaction_time`,
      [accountId, assetName]
    );
    return rows;
  } finally {
    conn.release();
  }
};

const createTransaction = async (transactionData) => {
  const {
    asset_id,
    transaction_type_id,
    quantity,
    price_per_unit,
    transaction_amount,
    transaction_time,
  } = transactionData;

  const [result] = await pool.query(
    `INSERT INTO transactions 
    (asset_id, transaction_type_id, quantity, price_per_unit, transaction_amount, transaction_time) 
    VALUES (?, ?, ?, ?, ?, ?)`,
    [asset_id, transaction_type_id, quantity, price_per_unit, transaction_amount, transaction_time]
  );

  return result.insertId;
};

const getTransactionsByAsset = async (asset_id) => {
  const [results] = await pool.query(
    'SELECT * FROM transactions WHERE asset_id = ?',
    [asset_id]
  );

  return results;
};

const getTransactionTypeId = async (transaction_type) => {
  const [rows] = await pool.query(
    'SELECT transaction_type_id FROM transaction_types WHERE type_name = ?',
    [transaction_type]
  );
  return rows.length > 0 ? rows[0].transaction_type_id : null;
};

const getAssetIdByName = async (asset_name) => {
  const [rows] = await pool.query(
    'SELECT asset_id FROM assets WHERE asset_name = ?',
    [asset_name]
  );
  return rows.length > 0 ? rows[0].asset_id : null;
};

const updateAssetForBuy = async (connection, asset_id, quantity, transaction_amount) => {
  await connection.query(
    `UPDATE assets 
     SET current_quantity = current_quantity + ?, 
         total_amount = total_amount + ?, 
         average_price = (total_amount + ?) / (current_quantity + ?) 
     WHERE asset_id = ?`,
    [quantity, transaction_amount, transaction_amount, quantity, asset_id]
  );
};

const updateAssetForSell = async (connection, asset_id, quantity, transaction_amount) => {
  const [asset] = await connection.query(
    'SELECT current_quantity FROM assets WHERE asset_id = ?',
    [asset_id]
  );
  if (asset[0].current_quantity < quantity) {
    throw new Error('Not enough quantity to sell.');
  }
  await connection.query(
    `UPDATE assets 
     SET current_quantity = current_quantity - ?, 
         total_amount = total_amount - ? 
     WHERE asset_id = ?`,
    [quantity, transaction_amount, asset_id]
  );
};

module.exports = {
  getTransactionHistory: exports.getTransactionHistory,
  getPriceTrend: exports.getPriceTrend,
  createTransaction,
  getTransactionsByAsset,
  getTransactionTypeId,
  getAssetIdByName,
  updateAssetForBuy,
  updateAssetForSell,
};
