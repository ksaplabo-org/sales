const sequelize = require("sequelize");

module.exports.getOrdersModel = (db) => {
  var orders = db.define(
    "orders",
    {
      order_no: {
        field: "order_no",
        type: sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      client_no: {
        field: "client_no",
        type: sequelize.INTEGER,
        allowNull: false,
      },
      order_date: {
        field: "order_date",
        type: sequelize.DATEONLY,
        allowNull: false,
      },
      ship_date: {
        field: "ship_date",
        type: sequelize.DATEONLY,
        allowNull: false,
      },
      deliver_date: {
        field: "deliver_date",
        type: sequelize.DATEONLY,
        allowNull: false,
      },
      product_code: {
        field: "product_code",
        type: sequelize.INTEGER,
        allowNull: false,
      },
      amount: {
        field: "amount",
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

  //結合処理
  orders.associate = function (clientsModel, productsModel) {
    orders.belongsTo(clientsModel, {
      foreignKey: "client_no",
      targetKey: "client_no",
    });
    orders.belongsTo(productsModel, {
      foreignKey: "product_code",
      targetKey: "product_code",
    });
  };

  return orders;
};
