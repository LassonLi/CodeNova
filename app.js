const cors = require('cors');
const express = require('express');
const stockApiRouter = require('./routes/stockApi');
const assetsRouter = require('./routes/assets');
const transactionsRouter = require('./routes/transactions');

const app = express();
const port = 3000;

// Middleware
app.use(express.json());

app.use(cors()); // Enable CORS for all routes

// Routes
app.use('/stockApi', stockApiRouter); // Use the stockApi router
app.use('/assets', assetsRouter); // Use the assets router
app.use('/transactions', transactionsRouter); // Use the transactions router


// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});