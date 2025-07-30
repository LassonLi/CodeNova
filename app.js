const express = require('express');
const assetsTypesRouter = require('./routes/assetsTypes');
const stockApiRouter = require('./routes/stockApi');
const assetsRouter = require('./routes/assets');
const transactionTypesRouter = require('./routes/transactionTypes');
const transactionsRouter = require('./routes/transactions');
const accountsRouter = require('./routes/accounts');

const app = express();
const port = 3000;

// Middleware
app.use(express.json());

// Routes
app.use('/stockApi', stockApiRouter); // Use the stockApi router
app.use('/assets', assetsRouter); // Use the assets router
app.use('/transactions', transactionsRouter); // Use the transactions router


// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});