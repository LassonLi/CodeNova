const db = require('../db');

exports.createAsset = (req, res) => {
  const data = req.body;
  db.query('INSERT INTO assets SET ?', data, (err, result) => {
        if (err) {
          console.error('Error creating asset:', err.message);
          return res.status(500).json({ error: 'An internal server error occurred' });
        }
    res.status(201).json({ assetId: result.insertId });
  });
};

exports.getAssetsByAccount = (req, res) => {
  const { account_id } = req.params;
  db.query('SELECT * FROM assets WHERE account_id = ?', [account_id], (err, results) => {
        if (err) {
          console.error('Database query error:', err.message);
          return res.status(500).json({ error: 'An internal server error occurred.' });
        }
    res.json(results);
  });
};

exports.updateAsset = (req, res) => {
  const { asset_id } = req.params;
  db.query('UPDATE assets SET ? WHERE asset_id = ?', [req.body, asset_id], (err, result) => {
        if (err) {
      console.error('Database query error:', err.message);
      return res.status(500).json({ error: 'An internal server error occurred.' });
    }
    res.json({ updated: result.affectedRows });
  });
};

exports.deleteAsset = (req, res) => {
  const { asset_id } = req.params;
  db.query('DELETE FROM assets WHERE asset_id = ?', [asset_id], (err, result) => {
        if (err) {
      console.error('Database query error:', err.message);
      return res.status(500).json({ error: 'An internal server error occurred.' });
    }
    res.json({ deleted: result.affectedRows });
  });
};
