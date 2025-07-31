const sequelize = require("sequelize");

module.exports.getUserModel = (db) => {
  return db.define(
    "user",
    {
      user_id: {
        field: "user_id",
        type: sequelize.STRING(16),
        primaryKey: true,
        allowNull: false,
      },
      user_name: {
        field: "user_name",
        type: sequelize.STRING(100),
        allowNull: false,
      },
      password: {
        field: "password",
        type: sequelize.STRING(16),
        allowNull: false,
      },
      gender: {
        field: "gender",
        type: sequelize.STRING(1),
        allowNull: false,
      },
      auth: {
        field: "auth",
        type: sequelize.STRING(1),
        allowNull: false,
      },
      address: {
        field: "address",
        type: sequelize.STRING(150),
        allowNull: true,
      },
    },
    {
      createdAt: false, //デフォルト項目を生成しないように
      updatedAt: false, //デフォルト項目を生成しないように
      tableName: "user", //明示的にテーブル名を指定
    }
  );
};
