import { ApolloServer } from "apollo-server-express";
import express from "express";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { AppDataSource } from "./config/database";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import cors from "cors";

import RedisStore from "connect-redis";
import session from "express-session";
import { createClient } from "redis";
import { __prod__ } from "./constants";
import { MyContext } from "./types";

const main = async () => {
  await AppDataSource.initialize();

  const app = express();

  app.use(
    cors({
      origin: ["https://studio.apollographql.com"],
      credentials: true,
    })
  );

  // Initialize client.
  let redisClient = createClient({
    url: "redis://:@127.0.0.1:7379",
  });
  redisClient.connect().catch(console.error);

  // Initialize store.
  let redisStore = new RedisStore({
    client: redisClient,
    prefix: "myapp:",
    disableTouch: true,
    disableTTL: true,
  });

  // Initialize session storage.
  app.use(
    session({
      name: "qid",
      store: redisStore,
      resave: false, // required: force lightweight session keep alive (touch)
      saveUninitialized: false, // recommended: only save session when data exists
      secret: "abkdl;akdfoejajsf",
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        sameSite: "none",
        secure: true,
      },
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PostResolver, UserResolver],
      validate: false,
      dateScalarMode: "isoDate",
    }),
    context: ({ req, res }): MyContext => ({ req, res }),
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => console.log("Server started on localhost:4000"));
};

main();
