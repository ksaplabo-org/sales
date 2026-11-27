-- 取引先TBL 作成
CREATE TABLE IF NOT EXISTS clients (
    client_code VARCHAR(8) NOT NULL PRIMARY KEY,
    order_kbn VARCHAR(1) NOT NULL,
    client_name VARCHAR(20) NOT NULL,
    post_code CHAR(7),
    address1 VARCHAR(20),
    address2 VARCHAR(20),
    tel_number CHAR(13),
    created_id CHAR(6) NOT NULL,
    created_at DATE NOT NULL,
    updated_id CHAR(6) NOT NULL,
    updated_at DATE NOT NULL
);

-- 取引先TBL 初期データ登録
INSERT INTO clients values ('a0000001', '1', '商事', '0600001','A県B市C区1条1丁目1-1', '', '090-0000-0000', 'user01', now(), 'user01', now());
INSERT INTO clients values ('a0000002', '2', 'B株式会社', '0600002','D府E市F区2条2丁目2-2Aビル 7階', '', '080-0000-0000', 'user01', now(), 'user01', now());
INSERT INTO clients values ('a0000003', '2', 'C有限会社', '0600003','G県H市I区3条3丁目3-3Bビル 6階', '', '070-0000-0000', 'user01', now(), 'user01', now());
INSERT INTO clients values ('a0000004', '1', 'D有限会社', '0600004','G県H市I区13条31丁目3-3Bビル', '28階', '060-0000-0000', 'user01', now(), 'user01', now());
INSERT INTO clients values ('11111111', '1', '会社', '0600005','J県K市L区13条31丁目3-MMビル', '42階', '010-0000-0000', 'user01', now(), 'user01', now());