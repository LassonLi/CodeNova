-- Create and select the database
CREATE DATABASE IF NOT EXISTS properties;
USE properties;

-- 1. ACCOUNTS 
CREATE TABLE accounts (
  account_id INT AUTO_INCREMENT PRIMARY KEY,
  account_name VARCHAR(100) NOT NULL,
  a_password VARCHAR(100) NOT NULL, -- Hash at app level
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. ASSET_TYPES 
CREATE TABLE asset_types (
  asset_type_id INT AUTO_INCREMENT PRIMARY KEY,
  type_name VARCHAR(50) NOT NULL UNIQUE -- values:('stock'), ('bonds'), ('cash'), ('others');
);

-- 3. ASSETS 
CREATE TABLE assets (
  asset_id INT AUTO_INCREMENT PRIMARY KEY,
  account_id INT NOT NULL,
  asset_type_id INT NOT NULL,
  asset_name VARCHAR(100) NOT NULL,
  current_quantity DECIMAL(20, 8),                
  current_price_per_unit DECIMAL(20, 8),
  purchase_price DECIMAL(20, 8),       -- Optional: first purchase
  average_price DECIMAL(20, 8),        -- Optional: average across transactions
  total_amount DECIMAL(20, 8),         
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (account_id) REFERENCES accounts(account_id),
  FOREIGN KEY (asset_type_id) REFERENCES asset_types(asset_type_id)
);

-- 4. TRANSACTION_TYPES 
CREATE TABLE transaction_types (
  transaction_type_id INT AUTO_INCREMENT PRIMARY KEY,
  type_name VARCHAR(50) NOT NULL UNIQUE -- values:('buy'), ('sell'), ('deposit'), ('withdraw'), ('dividend')
);

-- 5. TRANSACTIONS 
CREATE TABLE transactions (
  transaction_id INT AUTO_INCREMENT PRIMARY KEY,
  asset_id INT NOT NULL,
  transaction_type_id INT NOT NULL,
  quantity DECIMAL(20, 8),
  price_per_unit DECIMAL(20, 8),
  transaction_amount DECIMAL(20, 8) NOT NULL,
  transaction_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (asset_id) REFERENCES assets(asset_id),
  FOREIGN KEY (transaction_type_id) REFERENCES transaction_types(transaction_type_id)
);

INSERT INTO accounts (account_name, a_password)
VALUES ('admin', '$2b$10$N9qo8uLOickgx2ZMRZo5i.ez5j6p7U0e4bY3Ue5K9E2K5Z5K5Z5K5');

INSERT INTO asset_types (type_name)
VALUES ('stock'), ('bonds'), ('cash'), ('others');

INSERT INTO transaction_types (type_name)
VALUES ('buy'), ('sell'), ('deposit'), ('withdraw'), ('dividend');
select * from transactions;
INSERT INTO assets (
  account_id, asset_type_id, asset_name,
  current_quantity, current_price_per_unit,
  purchase_price, average_price, total_amount
) VALUES
(1, 1, 'AAPL', 50.00, 195.32, 190.00, 192.50, 9625.00),
(1, 1, 'GOOGL', 10.00, 2842.10, 2700.00, 2771.05, 27710.50),
(1, 2, 'BTC', 0.25, 29650.20, 29000.00, 29325.10, 7331.28);
