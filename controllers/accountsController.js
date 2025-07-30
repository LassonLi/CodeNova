const { pool} = require('../config/db');
const bcrypt = require('bcrypt');

exports.createAccount = async (req, res) => {
  const { account_name, a_password } = req.body;

  // 验证输入
  if (!account_name || !a_password) {
    return res.status(400).json({ error: 'Missing required fields: account_name or a_password.' });
  }

  let connection;
  try {
    // 加密密码
    const hashedPassword = await bcrypt.hash(a_password, 10);

    // 获取数据库连接
    connection = await pool.getConnection();

    // 插入数据
    const [result] = await connection.query(
      'INSERT INTO accounts (account_name, a_password) VALUES (?, ?)',
      [account_name, hashedPassword]
    );

    // 返回新创建的账户 ID
    res.status(201).json({ accountId: result.insertId });
  } catch (err) {
    console.error('Database query error in createAccount:', err.message);
    res.status(500).json({ error: 'An internal server error occurred.' });
  } finally {
    // 确保连接被释放
    if (connection) connection.release();
  }
};

// exports.createAccount = async (req, res) => {
//   const { account_name, a_password } = req.body;
//   try {
//     const hashed = await bcrypt.hash(a_password, 10);
//     pool.query(
//       'INSERT INTO accounts (account_name, a_password) VALUES (?, ?)',
//       [account_name, hashed],
//       (err, results) => {
//             if (err) {
//       console.error('Database query error:', err.message);
//       return res.status(500).json({ error: 'An internal server error occurred.' });
//     }
//         res.status(201).json({ accountId: results.insertId });
//       }
//     );
//   } catch (err) {
//     res.status(500).json({ error: 'Server error' });
//   }
// };
