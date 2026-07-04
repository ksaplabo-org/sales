import { DATE, DATEONLY, STRING, Model, BOOLEAN, INTEGER } from "sequelize";
import sequelize from "../config/database.js";

class UserModel extends Model {}

UserModel.init(
  {
    userId: {
      field: "user_id",
      type: STRING(6),
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
      allowNull: true,
    },
    role: {
      field: "role",
      type: STRING(150),
      allowNull: true,
    },
    delFlg: {
      field: "del_flg",
      type: BOOLEAN,
      allowNull: true,
    },
    createdId: {
      field: "created_id",
      type: STRING(6),
      allowNull: false,
    },
    createdAt: {
      field: "created_at",
      type: DATE,
      allowNull: true,
    },
    updatedId: {
      field: "updated_id",
      type: STRING(6),
      allowNull: false,
    },
    updatedAt: {
      field: "updated_at",
      type: DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "users",
    timestamps: true,
  },
);

export default UserModel;
