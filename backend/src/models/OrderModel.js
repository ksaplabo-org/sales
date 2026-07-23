import { DATE, DATEONLY, STRING, Model, BOOLEAN, INTEGER } from "sequelize";
import sequelize from "../config/database.js";

class UserModel extends Model {}

OrderModel.init(
  {
    orderNo: {
      field: "order_no",
      type: STRING(8),
      primaryKey: true,
      allowNull: false,
    },
    orderKbn: {
      field: "order_kbn",
      type: STRING(1),
      allowNull: false,
    },
    clientCode: {
      field: "client_code",
      type: STRING(8),
      allowNull: false,
    },
    orderDate: {
      field: "order_date",
      type: DATEONLY,
      allowNull: false,
    },
    confirmedDate: {
      field: "confirmed_date",
      type: DATEONLY,
      allowNull: true,
    },
    shipDate: {
      field: "ship_date",
      type: DATEONLY,
      allowNull: true,
    },
    deliverDate: {
      field: "deliver_date",
      type: DATEONLY,
      allowNull: true,
    },
    productCode: {
      field: "product_code",
      type: STRING(7),
      allowNull: false,
    },
    quantity: {
      field: "quantity",
      type: INTEGER,
      allowNull: false,
    },
    amount: {
      field: "amount",
      type: INTEGER,
      allowNull: false,
    },
    tax: {
      field: "tax",
      type: INTEGER,
      allowNull: false,
    },
    amountTaxIncluded: {
      field: "amount_tax_included",
      type: INTEGER,
      allowNull: false,
    },
    createdId: {
      field: "created_id",
      type: STRING(6),
      allowNull: false,
    },
    createdAt: {
      field: "created_at",
      type: DATE,
      allowNull: false,
    },
    updatedId: {
      field: "updated_id",
      type: STRING(6),
      allowNull: false,
    },
    updatedAt: {
      field: "updated_at",
      type: DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "orders",
    timestamps: true,
  }
);

export default UserModel;
