const cors = require('cors');
const express = require('express');
const { swaggerUi, swaggerSpec } = require('./swagger');

const stockApiRouter = require('./routes/stockApi');
const assetsRouter = require('./routes/assets');
const transactionsRouter = require('./routes/transactions');

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/stockApi', stockApiRouter); // Use the stockApi router
app.use('/assets', assetsRouter); // Use the assets router
app.use('/transactions', transactionsRouter); // Use the transactions router

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    console.log(`API documentation available at http://localhost:${port}/api-docs`);
});