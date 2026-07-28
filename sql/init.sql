USE sales;

#------------------------------------------
# ユーザーTBL 作成
#------------------------------------------
DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS users
(
    user_id char(6) NOT NULL PRIMARY KEY,
    password varchar(20) NOT NULL,
    last_name varchar(10) NOT NULL,
    first_name varchar(10) NOT NULL,
    role char(1) NOT NULL,
    birthday date,
    del_flg boolean NOT NULL,
    created_id char(6) NOT NULL,
    created_at datetime NOT NULL,
    updated_id char(6) NOT NULL,
    updated_at datetime NOT NULL
)
CHARACTER SET utf8mb4
COLLATE utf8mb4_0900_ai_ci;

#------------------------------------------
# ユーザーTBL 初期データ登録
#------------------------------------------
DELETE FROM users;
INSERT INTO users values ("user01", "user01", "山田", "太郎","2", "1990/01/01", false, "user01", now(), "user01", now());
INSERT INTO users values ("user02", "user02", "鈴木", "花子","1", "2000/01/01", false, "user01", now(), "user01", now());
INSERT INTO users values ("user03", "user03", "佐々木", "次郎","2", "1995/01/01", false, "user01", now(), "user01", now());
INSERT INTO users values ("user04", "user04", "森", "桜","1", "1993/01/01", false, "user01", now(), "user01", now());




#------------------------------------------
# 商品TBL 作成
#------------------------------------------
DROP TABLE IF EXISTS products;
CREATE TABLE IF NOT EXISTS products
(
    product_code char(7) NOT NULL PRIMARY KEY,
    order_kbn char(1) NOT NULL,
    order_client_code char(8) NULL,
    product_name varchar(20) NOT NULL,
    product_price INTEGER NOT NULL,
    created_id char(6) NOT NULL,
    created_at datetime NOT NULL,
    updated_id char(6) NOT NULL,
    updated_at datetime NOT NULL
)
CHARACTER SET utf8mb4
COLLATE utf8mb4_0900_ai_ci;

#------------------------------------------
# 商品TBL 初期データ登録
#------------------------------------------
DELETE FROM products;
INSERT INTO products values ("aa00001", "1", "", "りんご",150, "user01", now(), "user01", now());
INSERT INTO products values ("aa00002", "2", "a0000002", "搾りたて生醤油", 350, "user01", now(), "user01", now());
INSERT INTO products values ("aa00003", "1", "", "お餅", 100, "user01", now(), "user01", now());
INSERT INTO products values ("aa00004", "2", "a0000003", "PC", 360000, "user01", now(), "user01", now());




#------------------------------------------
# 取引先TBL 作成
#------------------------------------------
DROP TABLE IF EXISTS clients;
CREATE TABLE IF NOT EXISTS clients
(
    client_code char(8) NOT NULL PRIMARY KEY,
    order_kbn char(1) NOT NULL,
    client_name varchar(20) NOT NULL,
    post_code char(7),
    address1 varchar(20),
    address2 varchar(20),
    tel_namber char(13),
    created_id char(6) NOT NULL,
    created_at datetime NOT NULL,
    updated_id char(6) NOT NULL,
    updated_at datetime NOT NULL
)
CHARACTER SET utf8mb4
COLLATE utf8mb4_0900_ai_ci;
 
#------------------------------------------
# 取引先TBL 初期データ登録
#------------------------------------------
DELETE FROM clients;
INSERT INTO clients values ("a0000001", "1", "A商事", "0600001","A県B市C区1条1丁目1-1", "", "090-0000-0000", "user01", now(), "user01", now());
INSERT INTO clients values ("a0000002", "2", "B株式会社", "0600002","D府E市F区2条2丁目2-2Aビル 7階", "", "080-0000-0000", "user01", now(), "user01", now());
INSERT INTO clients values ("a0000003", "2", "C有限会社", "0600003","G県H市I区3条3丁目3-3Bビル 6階", "", "070-0000-0000", "user01", now(), "user01", now());
INSERT INTO clients values ("a0000004", "1", "D有限会社", "0600004","G県H市I区13条31丁目3-3Bビル", "28階", "060-0000-0000", "user01", now(), "user01", now());




#------------------------------------------
# 受発注情報TBL 作成
#------------------------------------------
DROP TABLE IF EXISTS orders;
CREATE TABLE IF NOT EXISTS orders
(
    order_no char(8) NOT NULL PRIMARY KEY,
    order_kbn char(1) NOT NULL,
    client_code char(8) NOT NULL,
    order_date date NOT NULL,
    confirmed_date date NULL,
    ship_date date NULL,
    deliver_date date NULL,
    product_code char(7) NOT NULL,
    quantity INTEGER NOT NULL,
    amount INTEGER NOT NULL,
    tax INTEGER NOT NULL,
    amount_tax_included INTEGER NOT NULL,
    created_id char(6) NOT NULL,
    created_at datetime NOT NULL,
    updated_id char(6) NOT NULL,
    updated_at datetime NOT NULL
)
CHARACTER SET utf8mb4
COLLATE utf8mb4_0900_ai_ci;
 
#------------------------------------------
# 受発注情報TBL 初期データ登録
#------------------------------------------
DELETE FROM orders;
INSERT INTO orders values ("o1000001", "1", "a0000001", "2026-07-21", NULL, "2026-07-28", "2026-08-04", "aa00001", "100", "15000", "1500", "16500", "user01", now(), "user01", now());
INSERT INTO orders values ("o1000002", "2", "a0000002", "2026-07-21", NULL,  NULL, "2026-08-04", "aa00002", "200", "70000", "7000", "77000", "user01", now(), "user01", now());
INSERT INTO orders values ("o1000003", "1", "a0000003", "2026-07-21", "2026-07-25",  "2026-07-28", "2026-08-04", "aa00003", "150", "15000", "1500", "16500", "user01", now(), "user01", now());
INSERT INTO orders values ("o1000004", "2", "a0000004", "2026-07-21", "2026-07-25",  NULL, "2026-08-04", "aa00004", "10", "3600000", "36000", "396000", "user01", now(), "user01", now());