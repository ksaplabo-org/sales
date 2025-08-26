const sequelize = require("sequelize");

module.exports.getProductsModel = (db) => {
   db.define(
    "products",
    {
      product_code: {
        field: "product_code",
        type: sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      product_name: {
        field: "product_name",
        type: sequelize.CHAR(20),
        allowNull: false,
      },
      price: {
        field: "price",
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
