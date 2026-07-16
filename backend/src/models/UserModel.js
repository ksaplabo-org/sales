import { BOOLEAN, CHAR, DATE, DATEONLY, STRING, Model } from "sequelize";
import sequelize from "../config/database.js";

class UserModel extends Model {}

UserModel.init(
  {
    userId: {
      field: "user_id",
      type: CHAR(6),
      primaryKey: true,
      allowNull: false,
    },
    password: {
      field: "password",
      type: STRING(20),
      allowNull: false,
    },
    lastName: {
      field: "last_name",
      type: STRING(10),
      allowNull: false,
    },
    firstName: {
      field: "first_name",
      type: STRING(10),
      allowNull: false,
    },
    birthday: {
      field: "birthday",
      type: DATEONLY,
      allowNull: false,
    },
    role: {
      field: "role",
      type: CHAR(1),
      allowNull: false,
    },
    delFlg: {
      field: "del_flg",
      type: BOOLEAN,
      allowNull: false,
    },
    createdId: {
      field: "created_id",
      type: CHAR(6),
      allowNull: false,
    },
    createdAt: {
      field: "created_at",
      type: DATE,
      allowNull: false,
    },
    updatedId: {
      field: "updated_id",
      type: CHAR(6),
      allowNull: false,
    },
    updatedAt: {
      field: "updated_at",
      type: DATE,
      allowNull: false,
    },
  },
  {
    sequelize, // 接続情報
    tableName: "users", // 実際のテーブル名を指定
    timestamps: false, // createdAt, updatedAtの自動管理
  },
);

export default UserModel;
