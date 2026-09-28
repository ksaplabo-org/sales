import { DATE, STRING, Model, CHAR, TEXT, DATEONLY } from "sequelize";
import sequelize from "../config/database.js";

class NoticeModel extends Model {}

NoticeModel.init(
  {
    noticeId: {
      field: "notice_id",
      type: CHAR(7),
      primaryKey: true,
      allowNull: false,
    },
    title: {
      field: "title",
      type: STRING(20),
      allowNull: false,
    },
    content: {
      field: "content",
      type: TEXT,
      allowNull: false,
    },
    startDate: {
      field: "start_date",
      type: DATEONLY,
      allowNull: false,
    },
    endDate: {
      field: "end_date",
      type: DATEONLY,
      allowNull: false,
    },
    targetType: {
      field: "target_type",
      type: CHAR(1),
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

export default NoticeModel;
