import "reflect-metadata";
import { AppDataSource } from "./config/database";

const main = async () => {
  await AppDataSource.initialize();
};

main();
