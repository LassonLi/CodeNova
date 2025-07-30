const transactionModel = require('../models/transactionModel');

exports.createTransaction = async (req, res) => {
  const {
    asset_name,
    transaction_type, 
    quantity = null,
    price_per_unit = null,
    transaction_amount,
    transaction_time = new Date(),
  } = req.body;

  // Validate required fields
  if (!asset_name || !transaction_type || !quantity || !price_per_unit || !transaction_amount) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  try {
    // Map transaction_type to transaction_type_id (assumes a helper function or mapping exists)
    const transaction_type_id = await transactionModel.getTransactionTypeId(transaction_type);

    // Get asset_id based on asset_name (assumes a helper function exists)
    const asset_id = await transactionModel.getAssetIdByName(asset_name);

    if (!transaction_type_id || !asset_id) {
      return res.status(400).json({ error: 'Invalid asset_name or transaction_type.' });
    }

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

const transactionModel = require('../models/transactionModel');

//getTransaction by asset_id
exports.getTransaction = async (req, res) => {
  const { asset_id } = req.params;

  // Validate required fields
  if (!asset_id) {
    return res.status(400).json({ error: 'Missing required field: asset_id.' });
  }

  try {
    const transaction = await transactionModel.getTransactionsByAsset(asset_id);
    res.json(transaction);
  } catch (err) {
    console.error('Error fetching transaction by asset:', err.message);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
};

//getTransactionsHistory(15)
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await transactionModel.getTransactions(15);
    res.json(transactions);
  } catch (err) {
    console.error('Error fetching limited transactions:', err.message);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
};