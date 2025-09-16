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
INSERT INTO users values (4, "c2", "password","一般用アカウント2", 0, 1, '2025-8-25 00:00:01', 1, '2025-8-25 00:00:01');
INSERT INTO users values (5, "e2", "password","役職用アカウント2", 2, 1, '2025-8-25 00:00:01', 1, '2025-8-25 00:00:01');
INSERT INTO users values (6, "c3", "password","一般用アカウント3", 0, 1, '2025-8-25 00:00:01', 1, '2025-8-25 00:00:01');
INSERT INTO users values (7, "e3", "password","役職用アカウント3", 2, 1, '2025-8-25 00:00:01', 1, '2025-8-25 00:00:01');
INSERT INTO users values (8, "c4", "password","一般用アカウント4", 0, 1, '2025-8-25 00:00:01', 1, '2025-8-25 00:00:01');
INSERT INTO users values (9, "e4", "password","役職用アカウント4", 2, 1, '2025-8-25 00:00:01', 1, '2025-8-25 00:00:01');
INSERT INTO users values (10, "c5", "password","一般用アカウント5", 0, 1, '2025-8-25 00:00:01', 1, '2025-8-25 00:00:01');
INSERT INTO users values (11, "e5", "password","役職用アカウント5", 2, 1, '2025-8-25 00:00:01', 1, '2025-8-25 00:00:01');
INSERT INTO users values (12, "c6", "password","一般用アカウント6", 0, 1, '2025-8-25 00:00:01', 1, '2025-8-25 00:00:01');
INSERT INTO users values (13, "e6", "password","役職用アカウント6", 2, 1, '2025-8-25 00:00:01', 1, '2025-8-25 00:00:01');
INSERT INTO users values (14, "c7", "password","一般用アカウント7", 0, 1, '2025-8-25 00:00:01', 1, '2025-8-25 00:00:01');
INSERT INTO users values (15, "e7", "password","役職用アカウント7", 2, 1, '2025-8-25 00:00:01', 1, '2025-8-25 00:00:01');
INSERT INTO users values (16, "c8", "password","一般用アカウント8", 0, 1, '2025-8-25 00:00:01', 1, '2025-8-25 00:00:01');

#------------------------------------------
# 商品情報TBL 初期データ登録
#------------------------------------------
DELETE FROM products;
INSERT INTO products values (1000001, "商品1", 100, 1, '2025-8-25 00:00:01', 1, '2025-8-25 00:00:01');
INSERT INTO products values (1000002, "商品2", 200, 1, '2025-8-25 00:00:01', 1, '2025-8-25 00:00:01');
INSERT INTO products values (1000003, "商品3", 300, 1, '2025-8-25 00:00:01', 1, '2025-8-25 00:00:01');
INSERT INTO products values (1000004, "商品4", 400, 1, '2025-8-25 00:00:01', 1, '2025-8-25 00:00:01');
INSERT INTO products values (1000005, "商品5", 500, 1, '2025-8-25 00:00:01', 1, '2025-8-25 00:00:01');
INSERT INTO products values (1000006, "商品6", 600, 1, '2025-8-25 00:00:01', 1, '2025-8-25 00:00:01');
INSERT INTO products values (1000007, "商品7", 700, 1, '2025-8-25 00:00:01', 1, '2025-8-25 00:00:01');
INSERT INTO products values (1000008, "商品8", 800, 1, '2025-8-25 00:00:01', 1, '2025-8-25 00:00:01');
INSERT INTO products values (1000009, "商品9", 900, 1, '2025-8-25 00:00:01', 1, '2025-8-25 00:00:01');
INSERT INTO products values (1000010, "商品10", 1000, 1, '2025-8-25 00:00:01', 1, '2025-8-25 00:00:01');
INSERT INTO products values (1000011, "商品11", 1100, 1, '2025-8-25 00:00:01', 1, '2025-8-25 00:00:01');
INSERT INTO products values (1000012, "商品12", 1200, 1, '2025-8-25 00:00:01', 1, '2025-8-25 00:00:01');
INSERT INTO products values (1000013, "商品13", 1300, 1, '2025-8-25 00:00:01', 1, '2025-8-25 00:00:01');
INSERT INTO products values (1000014, "商品14", 1400, 1, '2025-8-25 00:00:01', 1, '2025-8-25 00:00:01');
INSERT INTO products values (1000015, "商品15", 1500, 1, '2025-8-25 00:00:01', 1, '2025-8-25 00:00:01');
INSERT INTO products values (1000016, "商品16", 1600, 1, '2025-8-25 00:00:01', 1, '2025-8-25 00:00:01');

#------------------------------------------
# 顧客情報TBL 初期データ登録
#------------------------------------------
DELETE FROM clients;
INSERT INTO clients values (1, "顧客1", "000-0001","京都府","京都市", "000-0000-0001", 1, '2025-8-25 00:00:01', 1, '2025-8-25 00:00:01');
INSERT INTO clients values (2, "顧客2", "000-0002","新東京","箱根", "000-0000-0002", 1, '2025-8-25 00:00:01', 1, '2025-8-25 00:00:01');
INSERT INTO clients values (3, "顧客3", "000-0003","北海道","札幌", "000-0000-0003", 1, '2025-8-25 00:00:01', 1, '2025-8-25 00:00:01');
INSERT INTO clients values (4, "顧客4", "000-0004","北海道","江別市", "000-0000-0004", 1, '2025-8-25 00:00:01', 1, '2025-8-25 00:00:01');
INSERT INTO clients values (5, "顧客5", "000-0005","北海道","北斗市", "000-0000-0005", 1, '2025-8-25 00:00:01', 1, '2025-8-25 00:00:01');
INSERT INTO clients values (6, "顧客6", "000-0006","北海道","函館市", "000-0000-0006", 1, '2025-8-25 00:00:01', 1, '2025-8-25 00:00:01');
INSERT INTO clients values (7, "顧客7", "000-0007","青森県","三沢市", "000-0000-0007", 1, '2025-8-25 00:00:01', 1, '2025-8-25 00:00:01');
INSERT INTO clients values (8, "顧客8", "000-0008","宮城県","仙台市", "000-0000-0008", 1, '2025-8-25 00:00:01', 1, '2025-8-25 00:00:01');
INSERT INTO clients values (9, "顧客9", "000-0009","埼玉県","所沢市", "000-0000-0009", 1, '2025-8-25 00:00:01', 1, '2025-8-25 00:00:01');
INSERT INTO clients values (10, "顧客10", "000-0010","千葉県","幕張町", "000-0000-0010", 1, '2025-8-25 00:00:01', 1, '2025-8-25 00:00:01');
INSERT INTO clients values (11, "顧客11", "000-0011","大阪府","大阪市", "000-0000-0011", 1, '2025-8-25 00:00:01', 1, '2025-8-25 00:00:01');
INSERT INTO clients values (12, "顧客12", "000-0012","福岡県","福岡市", "000-0000-0012", 1, '2025-8-25 00:00:01', 1, '2025-8-25 00:00:01');
INSERT INTO clients values (13, "顧客13", "000-0013","神奈川県","横浜市", "000-0000-0013", 1, '2025-8-25 00:00:01', 1, '2025-8-25 00:00:01');
INSERT INTO clients values (14, "顧客14", "000-0014","広島県","広島市", "000-0000-0014", 1, '2025-8-25 00:00:01', 1, '2025-8-25 00:00:01');
INSERT INTO clients values (15, "顧客15", "000-0015","愛知県","名古屋市", "000-0000-0015", 1, '2025-8-25 00:00:01', 1, '2025-8-25 00:00:01');
INSERT INTO clients values (16, "顧客16", "000-0016","東京都","文京区", "000-0000-0016", 1, '2025-8-25 00:00:01', 1, '2025-8-25 00:00:01');



#------------------------------------------
# 受注情報TBL 初期データ登録
#------------------------------------------
DELETE FROM orders;
INSERT INTO orders values (2025082501, 1, "2025-08-01", "2025-08-02", "2025-08-03", 1000001, 10, 1, '2025-8-25 00:00:01', 1, '2025-8-25 00:00:01');
INSERT INTO orders values (2025082502, 2, "2025-08-15", "2025-08-16", "2025-08-17", 1000002, 20, 1, '2025-8-25 00:00:01', 1, '2025-8-25 00:00:01');
INSERT INTO orders values (2025082503, 3, "2025-08-30", "2025-08-31", "2025-09-01", 1000003, 30, 1, '2025-8-25 00:00:01', 1, '2025-8-25 00:00:01');

INSERT INTO orders values (2025082504, 4, "2020-08-01", "2020-08-02", "2020-08-03", 1000004, 40, 1, '2025-8-25 00:00:01', 1, '2025-8-25 00:00:01');
INSERT INTO orders values (2025082505, 5, "2020-08-15", "2020-08-16", "2020-08-17", 1000005, 50, 1, '2025-8-25 00:00:01', 1, '2025-8-25 00:00:01');
INSERT INTO orders values (2025082506, 6, "2020-08-30", "2020-08-31", "2020-09-01", 1000006, 60, 1, '2025-8-25 00:00:01', 1, '2025-8-25 00:00:01');

INSERT INTO orders values (2025082507, 7, "2020-09-01", "2020-09-02", "2020-09-03", 1000007, 70, 1, '2025-8-25 00:00:01', 1, '2025-8-25 00:00:01');
INSERT INTO orders values (2025082508, 8, "2020-09-15", "2020-09-16", "2020-09-17", 1000008, 80, 1, '2025-8-25 00:00:01', 1, '2025-8-25 00:00:01');
INSERT INTO orders values (2025082509, 9, "2020-09-30", "2020-10-01", "2020-10-02", 1000009, 90, 1, '2025-8-25 00:00:01', 1, '2025-8-25 00:00:01');

INSERT INTO orders values (2025082510, 10, "2025-05-01", "2025-05-02", "2025-05-03", 1000010, 80, 1, '2025-8-25 00:00:01', 1, '2025-8-25 00:00:01');
INSERT INTO orders values (2025082511, 11, "2025-05-15", "2025-05-16", "2025-05-17", 1000011, 70, 1, '2025-8-25 00:00:01', 1, '2025-8-25 00:00:01');
INSERT INTO orders values (2025082512, 12, "2025-05-30", "2025-05-31", "2025-06-01", 1000012, 60, 1, '2025-8-25 00:00:01', 1, '2025-8-25 00:00:01');

INSERT INTO orders values (2025082513, 13, "2020-06-01", "2020-06-02", "2020-06-03", 1000013, 50, 1, '2025-8-25 00:00:01', 1, '2025-8-25 00:00:01');
INSERT INTO orders values (2025082514, 14, "2020-06-15", "2020-06-16", "2020-06-17", 1000014, 40, 1, '2025-8-25 00:00:01', 1, '2025-8-25 00:00:01');
INSERT INTO orders values (2025082515, 15, "2020-06-16", "2020-06-17", "2020-06-18", 1000015, 30, 1, '2025-8-25 00:00:01', 1, '2025-8-25 00:00:01');
INSERT INTO orders values (2025082516, 16, "2020-06-30", "2020-07-01", "2020-07-02", 1000016, 20, 1, '2025-8-25 00:00:01', 1, '2025-8-25 00:00:01');


