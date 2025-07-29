const db = require('../db');

exports.createAsset = (req, res) => {
  const data = req.body;
  db.query('INSERT INTO assets SET ?', data, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ assetId: result.insertId });
  });
};

exports.getAssetsByAccount = (req, res) => {
  const { account_id } = req.params;
  db.query('SELECT * FROM assets WHERE account_id = ?', [account_id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.updateAsset = (req, res) => {
  const { asset_id } = req.params;
  db.query('UPDATE assets SET ? WHERE asset_id = ?', [req.body, asset_id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ updated: result.affectedRows });
  });
};

exports.deleteAsset = (req, res) => {
  const { asset_id } = req.params;
  db.query('DELETE FROM assets WHERE asset_id = ?', [asset_id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ deleted: result.affectedRows });
  });
};
