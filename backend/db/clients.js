const sequelize = require("sequelize");

module.exports.getClientsModel = (db) => {
  return db.define(
    "clients",
    {
      
      client_no: {
        field: "client_no",
        type: sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        field: "name",
        type: sequelize.CHAR(20),
        allowNull: false,
      },
      post_code: {
        field: "post_code",
        type: sequelize.CHAR(8),
        allowNull: false,
      },
      address1: {
        field: "address1",
        type: sequelize.CHAR(20),
        allowNull: false,
      },
      address2: {
        field: "address2",
        type: sequelize.CHAR(20),
        allowNull: false,
      },
      tel_no: {
        field: "address2",
        type: sequelize.CHAR(20),
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
