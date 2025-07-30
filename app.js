const express = require('express');
const cors = require('cors'); // 1. 在这里引入 cors 包
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

// 2. 在所有路由定义之前，使用 cors 中间件
// 这会为你的整个应用启用跨域资源共享（CORS）
app.use(cors());

// Routes
app.use('/assetsTypes', assetsTypesRouter); // Use the assetsTypes router
app.use('/stockApi', stockApiRouter); // Use the stockApi router
app.use('/assets', assetsRouter); // Use the assets router
app.use('/transactionTypes', transactionTypesRouter); // Use the transactionTypes router
app.use('/transactions', transactionsRouter); // Use the transactions router
app.use('/accounts', accountsRouter); // Use the accounts router

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});