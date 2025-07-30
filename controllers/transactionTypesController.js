const {pool} = require('../config/db');

exports.listTransactionTypes = async (req, res) => {
  let connection;
  try {
    // 获取数据库连接
    connection = await pool.getConnection();
    const [results] = await connection.query('SELECT * FROM transaction_types');
    res.json(results);
  } catch (err) {
    console.error("Database error in listTransactionTypes:", err.message);
    res.status(500).json({ error: "An internal server error occurred." });
  } finally {
    // 确保连接被释放
    if (connection) connection.release();
  }
};

exports.createTransactionType = async (req, res) => {
  const { type_name } = req.body;

  // 验证输入
  if (!type_name || typeof type_name !== 'string') {
    return res.status(400).json({ error: 'Invalid type_name provided.' });
  }

  let connection;
  try {
    // 获取数据库连接
    connection = await pool.getConnection();
    const [result] = await connection.query('INSERT INTO transaction_types (type_name) VALUES (?)', [type_name]);
    res.status(201).json({ transactionTypeId: result.insertId });
  } catch (err) {
    console.error('Database query error in createTransactionType:', err.message);
    res.status(500).json({ error: 'An internal server error occurred.' });
  } finally {
    // 确保连接被释放
    if (connection) {
      connection.release();
      console.log("Database connection released in createTransactionType.");
    }
  }
};

// exports.listTransactionTypes = (req, res) => {
//   pool.query('SELECT * FROM transaction_types', (err, results) => {
//         if (err) {
//           console.error('Database query error:', err.message);
//           return res.status(500).json({ error: 'An internal server error occurred.' });
//         }
//     res.json(results);
//   });
// };

// exports.createTransactionType = (req, res) => {
//   const { type_name } = req.body;
//   pool.query('INSERT INTO transaction_types (type_name) VALUES (?)', [type_name], (err, result) => {
//         if (err) {
//       console.error('Database query error:', err.message);
//       return res.status(500).json({ error: 'An internal server error occurred.' });
//     }
//     res.status(201).json({ transactionTypeId: result.insertId });
//   });
// };