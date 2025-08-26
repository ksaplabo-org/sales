USE sales;

#------------------------------------------
# ユーザーTBL 作成
#------------------------------------------
DROP TABLE IF EXISTS user;
CREATE TABLE IF NOT EXISTS user
(
    user_id char(16) NOT NULL PRIMARY KEY,
    user_name varchar(100) NOT NULL,
    password char(16) NOT NULL,
    gender char(1) NOT NULL,
    auth char(1) NOT NULL,
    address varchar(150)
)
CHARACTER SET utf8mb4
COLLATE utf8mb4_0900_ai_ci;

#------------------------------------------
# ユーザーTBL 初期データ登録
#------------------------------------------
DELETE FROM user;
INSERT INTO user values ("user0002", "ユーザー0002", "intern02", "1","2", "北海道札幌市中央区北1条北1-1-1");
INSERT INTO user values ("intern01", "一般", "intern01", "1","1", "北海道札幌市中央区北2条西2-2-2");
INSERT INTO user values ("intern03", "管理者", "intern03", "2","2", "北海道札幌市中央区北3条南3-3-3");
