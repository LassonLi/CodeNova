const db = require('../db');

exports.listAssetTypes = (req, res) => {
  db.query('SELECT * FROM asset_types', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.createAssetType = (req, res) => {
  const { type_name } = req.body;
  db.query('INSERT INTO asset_types (type_name) VALUES (?)', [type_name], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ assetTypeId: result.insertId });
  });
};
