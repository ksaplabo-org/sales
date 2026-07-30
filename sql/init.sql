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
    tel_number char(13),
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
