const {pool} = require('../config/db');

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

module.exports = {
  getTransactionHistory: exports.getTransactionHistory,
  getPriceTrend: exports.getPriceTrend,
  createTransaction,
  getTransactionsByAsset,
};
