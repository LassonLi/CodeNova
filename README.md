# CodeNova

## Team Members
Lasson Li, Eric Huang, David Zhao, Shea Jin, Rina Li  
2025/07/28

## Task Assignment

| Name        | Role                  |
|-------------|-----------------------|
| Lasson Li   | Back-End Developer    |
| Rina Li     | Back-End Developer    |
| Shea Jin    | Database Specialist   |
| David Zhao  | Front-End Developer   |
| Eric Huang  | Full-Stack Developer  |

---

## Overview of the CodeNova Project

The CodeNova project is a backend application built using Node.js and Express.js. It provides APIs for managing assets, transactions, and stock market data.

### Key Features

#### Asset Management
- APIs to create, update, and retrieve assets.
- Supports operations like buying, selling, depositing, and withdrawing assets.
- Tracks asset details such as quantity, price, and total amount.

#### Transaction Management
- APIs to create and retrieve transactions.
- Tracks transaction details such as asset name, type, quantity, price, and time.
- Supports operations like "buy", "sell", "deposit", and "withdraw".

#### Stock Market Data
- Fetches real-time stock prices and historical stock data using the Yahoo Finance API.
- Provides APIs to retrieve stock prices for specific symbols or random stocks.
- Supports fetching historical stock prices for a given symbol.

#### API Documentation
- Integrated Swagger UI for API documentation.
- Provides detailed documentation for all endpoints, including request and response formats.

---

## Project Structure

```
c:\Users\Administrator\Shea\CodeNova\CodeNova\
├── app.js                     # Main entry point of the application
├── config\
│   └── db.js                  # Database configuration and connection pool
├── controllers\
│   ├── assetsController.js    # Handles asset-related operations
│   ├── transactionsController.js # Handles transaction-related operations
│   └── yahooApiController.js  # Handles stock market data operations
├── models\
│   ├── assetModel.js          # Database queries for assets
│   ├── transactionModel.js    # Database queries for transactions
├── routes\
│   ├── assets.js              # Routes for asset-related APIs
│   ├── stockApi.js            # Routes for stock market data APIs
│   └── transactions.js        # Routes for transaction-related APIs
├── swagger.js                 # Swagger configuration for API documentation
└── node_modules\              # Dependencies installed via npm
```

---

## Key Components

### 1. Database Configuration (`config/db.js`)
- Uses `mysql2/promise` to manage database connections.
- Provides a connection pool for efficient database operations.

### 2. Controllers
- **`assetsController.js`**: Handles asset creation, updates, and retrieval. Integrates with `transactionsController` to log transactions during asset updates.
- **`transactionsController.js`**: Handles transaction creation and retrieval. Validates input and interacts with the database via `transactionModel`.
- **`yahooApiController.js`**: Fetches real-time stock prices and historical data using the Yahoo Finance API. Provides APIs for specific stock symbols and random stock selections.

### 3. Models
- **`assetModel.js`**: Contains database queries for managing assets. Supports operations like checking asset existence, updating assets, and inserting new assets.
- **`transactionModel.js`**: Contains database queries for managing transactions. Supports operations like creating transactions, fetching transactions by asset, and retrieving transaction history.

### 4. Routes
- **`assets.js`**: Defines routes for asset-related operations (e.g., `GET /assets/type/:type_name`, `PUT /assets/:asset_name`).
- **`transactions.js`**: Defines routes for transaction-related operations (e.g., `POST /transactions`, `GET /transactions/:asset_id`).
- **`stockApi.js`**: Defines routes for stock market data (e.g., `GET /stockApi/price/:symbol`, `GET /stockApi/history/:symbol`).

### 5. Swagger Integration (`swagger.js`)
- Configures Swagger UI for API documentation.
- Automatically generates documentation from annotations in route files.

---

## Example API Endpoints

### Asset Management
- `GET /assets/type/:type_name`: Fetch assets by type (e.g., stock, cash).
- `PUT /assets/:asset_name`: Update an asset and log a transaction.

### Transaction Management
- `POST /transactions`: Create a new transaction.
- `GET /transactions/:asset_id`: Fetch transactions for a specific asset.

### Stock Market Data
- `GET /stockApi/price/:symbol`: Fetch the current stock price for a given symbol.
- `GET /stockApi/history/:symbol`: Fetch historical stock prices for a given symbol.

---

## Technologies Used
- **Node.js**: Backend runtime environment.
- **Express.js**: Web framework for building APIs.
- **MySQL**: Relational database for storing assets and transactions.
- **Swagger**: API documentation and testing.
- **Yahoo Finance API**: Fetches real-time and historical stock market data.

---

## How to Run the Project

### Install Dependencies
```bash
npm install
```

### Start the Server
```bash
node app.js
```

### Access the API Documentation
Open [http://localhost:3000/api-docs](http://localhost:3000/api-docs) in your browser.

### Test the APIs
Use tools like Postman or cURL to test the endpoints.

---

## Potential Enhancements
- **Authentication**: Add user authentication and authorization for secure API access.
- **Error Handling**: Implement centralized error handling for better debugging and user feedback.
- **Unit Testing**: Add unit tests for controllers and models using a testing framework like Jest.
- **Environment Variables**: Use `.env` files to manage sensitive configurations like database credentials.

This project provides a solid foundation for managing assets, transactions, and stock market data, with room for further enhancements.