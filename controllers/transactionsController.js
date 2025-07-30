const {pool} = require('../config/db');

exports.createTransaction = async (req, res) => {
  const {
    asset_id,
    transaction_type_id,
    quantity,
    price_per_unit = null,
    transaction_amount = null,
    transaction_time = null
  } = req.body;

  // 验证必填字段
  if (!asset_id || !transaction_type_id || !quantity || !price_per_unit || !transaction_amount) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  let connection;
  try {
    // 获取数据库连接
    connection = await pool.getConnection();

    // 插入数据
    const [result] = await connection.query(
      `INSERT INTO transactions 
      (asset_id, transaction_type_id, quantity, price_per_unit, transaction_amount, transaction_time) 
      VALUES (?, ?, ?, ?, ?, ?)`,
      [asset_id, transaction_type_id, quantity, price_per_unit, transaction_amount, transaction_time]
    );

    // 返回新创建的交易 ID
    res.status(201).json({ transactionId: result.insertId });
  } catch (err) {
    console.error('Error creating transaction:', err.message);
    res.status(500).json({ error: 'An internal server error occurred.' });
  } finally {
    // 确保连接被释放
    if (connection) connection.release();
  }
};

exports.getTransactionsByAsset = async (req, res) => {
  const { asset_id } = req.params;

  // 验证必填字段
  if (!asset_id) {
    return res.status(400).json({ error: 'Missing required field: asset_id.' });
  }

  let connection;
  try {
    // 获取数据库连接
    connection = await pool.getConnection();

    // 查询交易记录
    const [results] = await connection.query(
      'SELECT * FROM transactions WHERE asset_id = ?',
      [asset_id]
    );

    // 返回交易记录
    res.json(results);
  } catch (err) {
    console.error('Error fetching transactions by asset:', err.message);
    res.status(500).json({ error: 'An internal server error occurred.' });
  } finally {
    // 确保连接被释放
    if (connection) connection.release();
  }
};

// exports.createTransaction = (req, res) => {
//   const data = req.body;
//   pool.query('INSERT INTO transactions SET ?', data, (err, result) => {
//         if (err) {
//       console.error('Database query error:', err.message);
//       return res.status(500).json({ error: 'An internal server error occurred.' });
//     }
//     res.status(201).json({ transactionId: result.insertId });
//   });
// };

// exports.getTransactionsByAsset = (req, res) => {
//   const { asset_id } = req.params;
//   pool.query('SELECT * FROM transactions WHERE asset_id = ?', [asset_id], (err, results) => {
//         if (err) {
//       console.error('Database query error:', err.message);
//       return res.status(500).json({ error: 'An internal server error occurred.' });
//     }
//     res.json(results);
//   });
// };
