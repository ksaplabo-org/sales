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
