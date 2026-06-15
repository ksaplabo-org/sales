import { Sequelize } from "sequelize";

const dbName = "sales";
const userName = "root";
const password = "root";

const sequelize = new Sequelize(dbName, userName, password, {
  dialect: "mysql",
  host: "localhost",
  pool: {
    max: 5,
    min: 1,
    acquire: 30000,
    idle: 10000,
  },
});

export default sequelize;
