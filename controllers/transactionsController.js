const transactionModel = require('../models/transactionModel');

exports.createTransaction = async (req, res) => {
  const {
    asset_type,
    transaction_type_id,
    quantity = null,
    price_per_unit = null,
    transaction_amount = null,
    transaction_time = new Date(),
  } = req.body;

  // Validate required fields
  if (!asset_id || !transaction_type_id || !quantity || !price_per_unit || !transaction_amount) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  try {
    const transactionId = await transactionModel.createTransaction({
      asset_id,
      transaction_type_id,
      quantity,
      price_per_unit,
      transaction_amount,
      transaction_time,
    });

    res.status(201).json({ transactionId });
  } catch (err) {
    console.error('Error creating transaction:', err.message);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
};

exports.getTransactions = async (req, res) => {
  const { asset_id } = req.params;

  // Validate required fields
  if (!asset_id) {
    return res.status(400).json({ error: 'Missing required field: asset_id.' });
  }

  try {
    const transactions = await transactionModel.getTransactionsByAsset(asset_id);
    res.json(transactions);
  } catch (err) {
    console.error('Error fetching transactions by asset:', err.message);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
};