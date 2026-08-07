import { CHAR, DATE, STRING, Model } from "sequelize";
import sequelize from "../config/database.js";

class ClientModel extends Model {}

ClientModel.init(
  {
    clientCode: {
      field: "client_code",
      type: CHAR(8),
      primaryKey: true,
      allowNull: false,
    },
    orderKbn: {
      field: "order_kbn",
      type: CHAR(1),
      allowNull: false,
    },
    clientName: {
      field: "client_name",
      type: STRING(20),
      allowNull: false,
    },
    postCode: {
      field: "post_code",
      type: CHAR(7),
      allowNull: true,
    },
    address1: {
      field: "address1",
      type: STRING(20),
      allowNull: true,
    },
    address2: {
      field: "address2",
      type: STRING(20),
      allowNull: true,
    },
    telNumber: {
      field: "tel_number",
      type: CHAR(13),
      allowNull: true,
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
    tableName: "clients",
    timestamps: false,
  }
);

export default ClientModel;
