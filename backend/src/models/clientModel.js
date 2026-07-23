import { DATE, STRING, Model, NUMBER } from "sequelize";
import sequelize from "../config/database.js";

class ClientModel extends Model {}

ClientModel.init(
  {
    clientCode: {
      field: "client_code",
      type: STRING(8),
      primaryKey: true,
      allowNull: false,
    },
    orderKbn: {
      field: "order_kbn",
      type: STRING(1),
      allowNull: false,
    },
    clientName: {
      field: "client_name",
      type: STRING(20),
      allowNull: false,
    },
    postCode: {
      field: "post_code",
      type: NUMBER(7),
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
      type: STRING(13),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "clients",
    timestamps: true,
  },
);

export default ClientModel;
