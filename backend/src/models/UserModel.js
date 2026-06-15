import { DATE, DATEONLY, STRING, Model, BOOLEAN } from "sequelize";
import sequelize from "#/config/database.js";

class UserModel extends Model {}

UserModel.init(
  {
    userId: {
      field: "user_id",
      type: STRING(16),
      primaryKey: true,
      allowNull: false,
    },
    userName: {
      field: "user_name",
      type: STRING(100),
      allowNull: false,
    },
    password: {
      field: "password",
      type: STRING(16),
      allowNull: false,
    },
    gender: {
      field: "gender",
      type: STRING(1),
      allowNull: false,
    },
    auth: {
      field: "auth",
      type: STRING(1),
      allowNull: false,
    },
    role: {
      field: "role",
      type: STRING(150),
      allowNull: true,
    },
    birthday: {
      field: "birthday",
      type: DATEONLY,
      allowNull: true,
    },
    createdAt: {
      field: "created_at",
      type: DATE,
      allowNull: true,
    },
    updatedAt: {
      field: "updated_at",
      type: DATE,
      allowNull: true,
    },
    deleteFlg: {
      field: "delete_flg",
      type: BOOLEAN,
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
