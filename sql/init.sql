USE sales;

#------------------------------------------
# ユーザーTBL 作成
#------------------------------------------
DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS users
(
    user_id char(16) NOT NULL PRIMARY KEY,
    user_name varchar(100) NOT NULL,
    password char(16) NOT NULL,
    gender char(1) NOT NULL,
    role char(1) NOT NULL,
    address varchar(150),
    birthday date,
    created_at datetime,
    updated_at datetime,
    delete_flg boolean NOT NULL
)
CHARACTER SET utf8mb4
COLLATE utf8mb4_0900_ai_ci;

#------------------------------------------
# ユーザーTBL 初期データ登録
#------------------------------------------
DELETE FROM users;
INSERT INTO users values ("user0002", "ユーザー0002", "intern02", "1","2", "北海道札幌市中央区北1条北1-1-1", "1990/01/01", now(), now(), false);
INSERT INTO users values ("user0003", "ユーザー0003", "intern04", "1","2", "北海道札幌市中央区北1条北1-1-1", "1990/01/01", now(), now(), true);
INSERT INTO users values ("intern01", "一般", "intern01", "1","1", "北海道札幌市中央区北2条西2-2-2", "1990/01/01", now(), now(), false);
INSERT INTO users values ("intern03", "管理者", "intern03", "2","2", "北海道札幌市中央区北3条南3-3-3", "1990/01/01", now(), now(), false);
