import "dotenv/config";
import "reflect-metadata";
import { DataSource } from "typeorm";

console.log("__dirname", __dirname);

const AppDataSource = new DataSource({
  type: "mssql",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "1433", 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true,
  logging: true,
  entities: [__dirname + "/entities/**/*.{ts,js}"],
  migrations: [__dirname + "/migrations/**/*.{ts,js}"],
  options: {
    encrypt: false,
    enableArithAbort: true,
    trustServerCertificate: true,
  },
});

export { AppDataSource };
