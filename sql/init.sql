USE sales;

#------------------------------------------
# ユーザー情報TBL 作成
#------------------------------------------
DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS users
(
    id int NOT NULL PRIMARY KEY,
    user_id char(4) NOT NULL,
    user_pass char(20) NOT NULL,
    user_name char(20) NOT NULL,
    user_role int NOT NULL,
    update_id int NOT NULL,
    update_date datetime NOT NULL,
    entry_id int NOT NULL,
    entry_date datetime NOT NULL
)
CHARACTER SET utf8mb4
COLLATE utf8mb4_0900_ai_ci;

#------------------------------------------
# 商品情報TBL 作成
#------------------------------------------
DROP TABLE IF EXISTS products;
CREATE TABLE IF NOT EXISTS products
(
    product_code int NOT NULL PRIMARY KEY,
    product_name char(20) NOT NULL,
    price int NOT NULL,
    update_id int NOT NULL,
    update_date datetime NOT NULL,
    entry_id int NOT NULL,
    entry_date datetime NOT NULL
)
CHARACTER SET utf8mb4
COLLATE utf8mb4_0900_ai_ci;

#------------------------------------------
# 顧客情報TBL 作成
#------------------------------------------
DROP TABLE IF EXISTS clients;
CREATE TABLE IF NOT EXISTS clients
(
    client_no int NOT NULL PRIMARY KEY,
    name char(20) NOT NULL,
    post_code CHAR(8),
    address1 CHAR(20),
    address2 CHAR(20),
    tel_no CHAR(20),
    update_id int NOT NULL,
    update_date datetime NOT NULL,
    entry_id int NOT NULL,
    entry_date datetime NOT NULL
)
CHARACTER SET utf8mb4
COLLATE utf8mb4_0900_ai_ci;

#------------------------------------------
# 受注情報TBL 作成
#------------------------------------------
DROP TABLE IF EXISTS orders;
CREATE TABLE IF NOT EXISTS orders
(
    order_no char(10) NOT NULL PRIMARY KEY,
    client_no int NOT NULL,
    order_date Date,
    ship_date Date,
    deliver_date Date,
    product_code int NOT NULL,
    amount int NOT NULL,
    update_id int NOT NULL,
    update_date datetime NOT NULL,
    entry_id int NOT NULL,
    entry_date datetime NOT NULL
)
CHARACTER SET utf8mb4
COLLATE utf8mb4_0900_ai_ci;


#------------------------------------------
# ユーザーTBL 初期データ登録
#------------------------------------------
DELETE FROM users;
INSERT INTO users values (1, "root", "password","管理者用アカウント", 1, 1, '2025-8-25 00:00:01', 1, '2025-8-25 00:00:01');
INSERT INTO users values (2, "como", "password","一般用アカウント", 0, 1, '2025-8-25 00:00:01', 1, '2025-8-25 00:00:01');
INSERT INTO users values (3, "erai", "password","役職用アカウント", 2, 1, '2025-8-25 00:00:01', 1, '2025-8-25 00:00:01');

#------------------------------------------
# 商品情報TBL 初期データ登録
#------------------------------------------
DELETE FROM products;
INSERT INTO products values (1000001, "商品1", 100, 1, '2025-8-25 00:00:01', 1, '2025-8-25 00:00:01');
INSERT INTO products values (1000002, "商品2", 200, 1, '2025-8-25 00:00:01', 1, '2025-8-25 00:00:01');
INSERT INTO products values (1000003, "商品3", 300, 1, '2025-8-25 00:00:01', 1, '2025-8-25 00:00:01');
INSERT INTO products values (9999999, "商品3", 300, 1, '2025-8-25 00:00:01', 1, '2025-8-25 00:00:01');

#------------------------------------------
# 顧客情報TBL 初期データ登録
#------------------------------------------
DELETE FROM clients;
INSERT INTO clients values (1, "顧客1", "000-0001","京都府","京都市", "000-0000-0001", 1, '2025-8-25 00:00:01', 1, '2025-8-25 00:00:01');
INSERT INTO clients values (2, "顧客2", "000-0002","新東京","箱根", "000-0000-0002", 1, '2025-8-25 00:00:01', 1, '2025-8-25 00:00:01');
INSERT INTO clients values (3, "顧客3", "000-0003","北海道","札幌", "000-0000-0003", 1, '2025-8-25 00:00:01', 1, '2025-8-25 00:00:01');


#------------------------------------------
# 受注情報TBL 初期データ登録
#------------------------------------------
DELETE FROM orders;
INSERT INTO orders values (2025082601, 1, "2025-08-26", "2025-08-27", "2025-08-28", 1000001, 10, 1, '2025-8-25 00:00:01', 1, '2025-8-25 00:00:01');
INSERT INTO orders values (2025082602, 2, "2025-08-26", "2025-08-27", "2025-08-28", 1000002, 20, 1, '2025-8-25 00:00:01', 1, '2025-8-25 00:00:01');
INSERT INTO orders values (2025082603, 3, "2025-08-26", "2025-08-27", "2025-08-28", 1000003, 30, 1, '2025-8-25 00:00:01', 1, '2025-8-25 00:00:01');
