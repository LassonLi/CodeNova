const db = require('../db');
const bcrypt = require('bcrypt');

exports.createAccount = async (req, res) => {
  const { account_name, a_password } = req.body;
  try {
    const hashed = await bcrypt.hash(a_password, 10);
    db.query(
      'INSERT INTO accounts (account_name, a_password) VALUES (?, ?)',
      [account_name, hashed],
      (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.status(201).json({ accountId: results.insertId });
      }
    );
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
