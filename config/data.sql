INSERT INTO assets (
account_id, asset_type_id, asset_name,
current_quantity, current_price_per_unit,
purchase_price, average_price, total_amount
) VALUES
(1, 1, 'AAPL', 50.00, 195.32, 190.00, 192.50, 9625.00),
(1, 1, 'GOOGL', 10.00, 2842.10, 2700.00, 2771.05, 27710.50),
(1, 1, 'TSLA', 20.00, 720.50, 700.00, 710.25, 14410.00);

-------------------------
INSERT INTO transactions (asset_id, transaction_type_id, quantity, price_per_unit, transaction_amount)
VALUES (1, 1, 100, 10.00, 1000.00);

INSERT INTO transactions (asset_id, transaction_type_id, quantity, price_per_unit, transaction_amount)
VALUES (2, 2, 50, 20.00, 1000.00);

INSERT INTO transactions (asset_id, transaction_type_id, quantity, price_per_unit, transaction_amount)
VALUES (3, 3, 200, 5.00, 1000.00);

INSERT INTO transactions (asset_id, transaction_type_id, quantity, price_per_unit, transaction_amount)
VALUES (3, 4, 25, 40.00, 1000.00);

INSERT INTO transactions (asset_id, transaction_type_id, quantity, price_per_unit, transaction_amount)
VALUES (1, 5, 10, 100.00, 1000.00);

INSERT INTO transactions (asset_id, transaction_type_id, quantity, price_per_unit, transaction_amount)
VALUES (2, 1, 60, 16.67, 1000.20);

INSERT INTO transactions (asset_id, transaction_type_id, quantity, price_per_unit, transaction_amount)
VALUES (3, 2, 70, 14.29, 1000.30);

INSERT INTO transactions (asset_id, transaction_type_id, quantity, price_per_unit, transaction_amount)
VALUES (2, 3, 80, 12.50, 1000.40);

INSERT INTO transactions (asset_id, transaction_type_id, quantity, price_per_unit, transaction_amount)
VALUES (1, 4, 90, 11.11, 1000.50);

INSERT INTO transactions (asset_id, transaction_type_id, quantity, price_per_unit, transaction_amount)
VALUES (2, 5, 100, 10.00, 1000.60);

INSERT INTO transactions (asset_id, transaction_type_id, quantity, price_per_unit, transaction_amount)
VALUES (3, 1, 110, 9.09, 1000.70);

INSERT INTO transactions (asset_id, transaction_type_id, quantity, price_per_unit, transaction_amount)
VALUES (3, 1, 110, 9.08, 1000.70);

INSERT INTO transactions (asset_id, transaction_type_id, quantity, price_per_unit, transaction_amount)
VALUES (1, 2, 120, 8.33, 1000.80);

INSERT INTO transactions (asset_id, transaction_type_id, quantity, price_per_unit, transaction_amount)
VALUES (1, 3, 130, 7.69, 1000.90);

INSERT INTO transactions (asset_id, transaction_type_id, quantity, price_per_unit, transaction_amount)
VALUES (2, 4, 140, 7.14, 1001.00);

INSERT INTO transactions (asset_id, transaction_type_id, quantity, price_per_unit, transaction_amount)
VALUES (3, 5, 150, 6.67, 1001.10);

