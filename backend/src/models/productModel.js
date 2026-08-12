import { DATE, STRING, Model, INTEGER, CHAR } from "sequelize";
import sequelize from "../config/database.js";

class ProductModel extends Model {}

ProductModel.init(
  {
    productCode: {
      field: "product_code",
      type: CHAR(7), 
      primaryKey: true,
      allowNull: false,
    },
    orderKbn: {
      field: "order_kbn",
      type: CHAR(1), 
      allowNull: false,
    },
    orderClientCode: {
      field: "order_client_code",
      type: CHAR(8), 
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
    sequelize,
    tableName: "products",
    timestamp: false,
  },
);

export default ProductModel;
