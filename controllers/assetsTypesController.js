const db = require('../db');

exports.listAssetTypes = (req, res) => {
  db.query('SELECT * FROM asset_types', (err, results) => {
        if (err) {
          console.error('Database error in listAssetTypes:', err);
          return res.status(500).json({ error: 'An internal server error occurred' });
        }
    res.json(results);
  });
};

exports.createAssetType = (req, res) => {
  const { type_name } = req.body;
  db.query('INSERT INTO asset_types (type_name) VALUES (?)', [type_name], (err, result) => {
        if (err) {
      console.error('Database query error:', err.message);
      return res.status(500).json({ error: 'An internal server error occurred.' });
    }
    res.status(201).json({ assetTypeId: result.insertId });
  });
};
