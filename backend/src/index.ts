import "dotenv/config";
import http from "http";
import express from "express";
import morgan from "morgan";
import { PrismaClient } from "@prisma/client";
import { ApolloServer } from "apollo-server-express";
import { graphqlUploadExpress } from "graphql-upload";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";

import { getUser } from "src/utils";
import { ApolloContext } from "src/types";

import { typeDefs, resolvers } from "./schema";

async function startServer() {
  // Required logic for integrating with Express
  const app = express();
  const httpServer = http.createServer(app);

  app.use(morgan("tiny"));
  app.use(graphqlUploadExpress());
  app.use("/public", express.static("public"));

  // Init prisma client
  const client = new PrismaClient();

  // Same ApolloServer initialization as before, plus the drain plugin.
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }): Promise<ApolloContext> => {
      const token = req.headers?.token as string;
      const user = await getUser(client, token);

      return { client, user };
    },
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  // More required logic for integrating with Express
  await server.start();
  server.applyMiddleware({
    app,

    // By default, apollo-server hosts its GraphQL endpoint at the
    // server root. However, *other* Apollo Server packages host it at
    // /graphql. Optionally provide this to match apollo-server.
    path: "/graphql",
  });

  // Modified server startup
  const port = process.env.PORT || 4000;
  httpServer.listen({ port }, () => {
    // eslint-disable-next-line no-console
    console.log(
      `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`
    );
  });
}

// eslint-disable-next-line no-console
startServer().catch(console.error);
