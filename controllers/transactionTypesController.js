const db = require('../db');

exports.listTransactionTypes = (req, res) => {
  db.query('SELECT * FROM transaction_types', (err, results) => {
        if (err) {
          console.error('Database query error:', err.message);
          return res.status(500).json({ error: 'An internal server error occurred.' });
        }
    res.json(results);
  });
};

exports.createTransactionType = (req, res) => {
  const { type_name } = req.body;
  db.query('INSERT INTO transaction_types (type_name) VALUES (?)', [type_name], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ transactionTypeId: result.insertId });
  });
};
