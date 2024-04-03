import "reflect-metadata";
import { AppDataSource } from "./config/database";
import express from "express";

const main = async () => {
  await AppDataSource.initialize();
  const app = express();
  app.listen(4000, () => console.log("Server started on localhost:4000"));
};

main();
