const {pool} = require('../config/db');

exports.listAssetTypes = async (req, res) => {
  let connection;
  try {
    // 获取数据库连接
    connection = await pool.getConnection();
    const [results] = await connection.query('SELECT * FROM asset_types');
    res.json(results);
  } catch (err) {
    console.error('Database error in listAssetTypes:', err.message);
    res.status(500).json({ error: 'An internal server error occurred' });
  } finally {
    // 确保连接被释放
    if (connection) connection.release();
  }
};

exports.createAssetType = async (req, res) => {
  const { type_name } = req.body;
  let connection;
  try {
    // 获取数据库连接
    connection = await pool.getConnection();
    const [result] = await connection.query('INSERT INTO asset_types (type_name) VALUES (?)', [type_name]);
    res.status(201).json({ assetTypeId: result.insertId });
  } catch (err) {
    console.error('Database query error:', err.message);
    res.status(500).json({ error: 'An internal server error occurred.' });
  } finally {
    // 确保连接被释放
    if (connection) connection.release();
  }
};
