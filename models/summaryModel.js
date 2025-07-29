const pool = require('../db');

exports.getPortfolioSummary = async (accountId) => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      `SELECT asset_name, current_quantity, average_price, current_price_per_unit,
        current_quantity * current_price_per_unit AS current_value,
        current_quantity * average_price AS invested_amount,
        (current_quantity * current_price_per_unit) - (current_quantity * average_price) AS gain_loss
       FROM assets
       WHERE account_id = ?`,
      [accountId]
    );

    const totalInvested = rows.reduce((sum, r) => sum + r.invested_amount, 0);
    const totalCurrentValue = rows.reduce((sum, r) => sum + r.current_value, 0);
    const totalGainLoss = totalCurrentValue - totalInvested;

    return { assets: rows, totalInvested, totalCurrentValue, totalGainLoss };
  } finally {
    conn.release();
  }
};
