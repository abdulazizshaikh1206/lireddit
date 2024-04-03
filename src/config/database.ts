import { __prod__ } from "../constants";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "192.168.60.173",
  port: 5432,
  username: "postgres",
  password: "1234",
  database: "lireddit",
  logging: !__prod__,
  entities: ["dist/entities/*.js"],
  migrations: ["dist/migrations/*.js"],
});
