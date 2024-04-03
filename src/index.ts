import { ApolloServer } from "apollo-server-express";
import express from "express";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { AppDataSource } from "./config/database";
import { PostResolver } from "./resolvers/post";

const main = async () => {
  await AppDataSource.initialize();

  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PostResolver],
      validate: false,
      dateScalarMode: "isoDate",
    }),
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => console.log("Server started on localhost:4000"));
};

main();
