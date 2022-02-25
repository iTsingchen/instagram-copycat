import type { PrismaClient, User } from "@prisma/client";
import type { PubSub } from "graphql-subscriptions";

export type ApolloContext = {
  client: PrismaClient;
  pubsub: PubSub;
  user?: User;
};
