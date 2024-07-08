import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const pgHost = process.env.PG_HOST;
const pgUser = process.env.PG_USER;
const pgPassword = process.env.PG_PASSWORD;
const pgDatabase = process.env.PG_DATABASE;
const pgPort = process.env.PG_PORT;

// instance Sequelize using variable
const config = new Sequelize(pgDatabase, pgUser, pgPassword, {
  host: pgHost,
  port: pgPort,
  dialect: "postgres",
  logging: console.log,
});

// checking connection
const Connect = async () => {
  try {
    await config.authenticate();
    console.log("Connection Success");
  } catch (error) {
    console.error("idk:", error);
  }
};

Connect();

export default config;
