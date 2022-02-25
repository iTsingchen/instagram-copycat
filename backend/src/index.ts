import "dotenv/config";

import { PrismaClient } from "@prisma/client";
import http from "http";
import express from "express";
import morgan from "morgan";
import { execute, subscribe } from "graphql";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { ApolloServer } from "apollo-server-express";
import { graphqlUploadExpress } from "graphql-upload";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import { PubSub } from "graphql-subscriptions";

import { getUser } from "src/utils";
import { ApolloContext } from "src/types";

import { schema } from "./schema";

async function startServer() {
  const pubsub = new PubSub();
  const client = new PrismaClient();

  // Required logic for integrating with Express
  const app = express();
  const httpServer = http.createServer(app);

  app.use(morgan("tiny"));
  app.use(graphqlUploadExpress());
  app.use("/public", express.static("public"));

  const subscriptionServer = SubscriptionServer.create(
    {
      // This is the `schema` we just created.
      schema,
      // These are imported from `graphql`.
      execute,
      subscribe,
      onConnect: async (params: { token?: string }): Promise<ApolloContext> => {
        const user = await getUser(client, params.token);
        return { user, client, pubsub };
      },
    },
    {
      // This is the `httpServer` we created in a previous step.
      server: httpServer,
      // Pass a different path here if your ApolloServer serves at
      // a different path.
      path: "/graphql",
    }
  );

  // Same ApolloServer initialization as before, plus the drain plugin.
  const server = new ApolloServer({
    schema,
    context: async ({ req }): Promise<ApolloContext> => {
      const token = req.headers?.token as string;
      const user = await getUser(client, token);

      return { client, user, pubsub };
    },
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        serverWillStart: async () => {
          await Promise.resolve(0);
          return {
            drainServer: async () => {
              await Promise.resolve(0);
              subscriptionServer.close();
            },
          };
        },
      },
    ],
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
