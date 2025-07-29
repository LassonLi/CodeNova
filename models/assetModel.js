const pool = require('../db');

exports.buyAsset = async (accountId, assetName, assetTypeId, quantity, pricePerUnit) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [assets] = await conn.query(
      'SELECT * FROM assets WHERE account_id = ? AND asset_name = ?',
      [accountId, assetName]
    );

    let assetId;
    if (assets.length === 0) {
      const [result] = await conn.query(
        `INSERT INTO assets (account_id, asset_type_id, asset_name, current_quantity, purchase_price, average_price, total_amount)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [accountId, assetTypeId, assetName, quantity, pricePerUnit, pricePerUnit, quantity * pricePerUnit]
      );
      assetId = result.insertId;
    } else {
      const asset = assets[0];
      const newQuantity = asset.current_quantity + quantity;
      const newTotalAmount = (asset.average_price * asset.current_quantity) + (pricePerUnit * quantity);
      const newAveragePrice = newTotalAmount / newQuantity;

      await conn.query(
        `UPDATE assets SET current_quantity = ?, average_price = ?, total_amount = ? WHERE asset_id = ?`,
        [newQuantity, newAveragePrice, newQuantity * newAveragePrice, asset.asset_id]
      );
      assetId = asset.asset_id;
    }

    await conn.query(
      `INSERT INTO transactions (asset_id, transaction_type_id, quantity, price_per_unit, transaction_amount)
       VALUES (?, (SELECT transaction_type_id FROM transaction_types WHERE type_name = 'buy'), ?, ?, ?)`,
      [assetId, quantity, pricePerUnit, quantity * pricePerUnit]
    );

    await conn.commit();
    return { success: true, assetId };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

exports.sellAsset = async (accountId, assetName, quantity, pricePerUnit) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [assets] = await conn.query(
      `SELECT * FROM assets WHERE account_id = ? AND asset_name = ?`,
      [accountId, assetName]
    );
    if (assets.length === 0) throw new Error('Asset not found');
    const asset = assets[0];
    if (asset.current_quantity < quantity) throw new Error('Not enough quantity to sell');

    const newQuantity = asset.current_quantity - quantity;

    await conn.query(
      `UPDATE assets SET current_quantity = ?, total_amount = ? WHERE asset_id = ?`,
      [newQuantity, newQuantity * asset.average_price, asset.asset_id]
    );

    await conn.query(
      `INSERT INTO transactions (asset_id, transaction_type_id, quantity, price_per_unit, transaction_amount)
       VALUES (?, (SELECT transaction_type_id FROM transaction_types WHERE type_name = 'sell'), ?, ?, ?)`,
      [asset.asset_id, quantity, pricePerUnit, quantity * pricePerUnit]
    );

    await conn.commit();
    return { success: true };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};
