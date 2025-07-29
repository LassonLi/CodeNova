const db = require('../db');

exports.createTransaction = (req, res) => {
  const data = req.body;
  db.query('INSERT INTO transactions SET ?', data, (err, result) => {
        if (err) {
      console.error('Database query error:', err.message);
      return res.status(500).json({ error: 'An internal server error occurred.' });
    }
    res.status(201).json({ transactionId: result.insertId });
  });
};

exports.getTransactionsByAsset = (req, res) => {
  const { asset_id } = req.params;
  db.query('SELECT * FROM transactions WHERE asset_id = ?', [asset_id], (err, results) => {
        if (err) {
      console.error('Database query error:', err.message);
      return res.status(500).json({ error: 'An internal server error occurred.' });
    }
    res.json(results);
  });
};
