const db = require('../db');

exports.createTransaction = (req, res) => {
  const data = req.body;
  db.query('INSERT INTO transactions SET ?', data, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ transactionId: result.insertId });
  });
};

exports.getTransactionsByAsset = (req, res) => {
  const { asset_id } = req.params;
  db.query('SELECT * FROM transactions WHERE asset_id = ?', [asset_id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};
