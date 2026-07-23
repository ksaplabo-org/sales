import { DATE, DATEONLY, STRING, Model, BOOLEAN, INTEGER } from "sequelize";
import sequelize from "../config/database.js";

class ProductModel extends Model {}

ProductModel.init(
  {
    productCode: {
      field: "product_code",
      type: STRING(7), //char
      primaryKey: true,
      allowNull: false,
    },
    orderKbn: {
      field: "order_kbn",
      type: STRING(1), //char
      allowNull: false,
    },
    orderClientCode: {
      field: "order_client_code",
      type: STRING(8), //char
      allowNull: true,
    },
    productName: {
      field: "product_name",
      type: STRING(20),
      allowNull: false,
    },
    productPrice: {
      field: "product_price",
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
    tableName: "products",
    timestamp: true,
  },
);

export default ProductModel;
