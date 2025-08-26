const sequelize = require("sequelize");

module.exports.getUsersModel = (db) => {
  return db.define(
    "users",
    {
      
      id: {
        field: "id",
        type: sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        field: "user_id",
        type: sequelize.CHAR(4),
        allowNull: false,
      },
      user_pass: {
        field: "user_pass",
        type: sequelize.CHAR(20),
        allowNull: false,
      },
      user_name: {
        field: "user_name",
        type: sequelize.CHAR(20),
        allowNull: false,
      },
      user_role: {
        field: "user_role",
        type: sequelize.INTEGER,
        allowNull: false,
      },
      update_id: {
        field: "update_id",
        type: sequelize.INTEGER,
        allowNull: false,
      },
      update_date: {
        field: "update_date",
        type: sequelize.DATE,
        allowNull: false,
      },
      entry_id: {
        field: "entry_id",
        type: sequelize.INTEGER,
        allowNull: false,
      },
      entry_date: {
        field: "entry_date",
        type: sequelize.DATE,
        allowNull: false,
      },
    },
    {
      createdAt: false, //デフォルト項目を生成しないように
      updatedAt: false, //デフォルト項目を生成しないように
      tableName: "users", //明示的にテーブル名を指定
    }
  );
};
