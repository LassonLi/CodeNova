const { pool} = require('../config/db');
const bcrypt = require('bcrypt');

exports.createAccount = async (req, res) => {
  const { account_name, a_password } = req.body;
  try {
    const hashed = await bcrypt.hash(a_password, 10);
    pool.query(
      'INSERT INTO accounts (account_name, a_password) VALUES (?, ?)',
      [account_name, hashed],
      (err, results) => {
            if (err) {
      console.error('Database query error:', err.message);
      return res.status(500).json({ error: 'An internal server error occurred.' });
    }
        res.status(201).json({ accountId: results.insertId });
      }
    );
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
