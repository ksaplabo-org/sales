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
INSERT INTO products values ("aa00002", "2", "aaa00001", "搾りたて生醤油", 350, "user01", now(), "user01", now());
INSERT INTO products values ("aa00003", "1", "", "お餅", 100, "user01", now(), "user01", now());
INSERT INTO products values ("aa00004", "2", "aaa00002", "PC", 360000, "user01", now(), "user01", now());