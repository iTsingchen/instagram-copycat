import { PrismaClient, User } from "@prisma/client";

export type ApolloContext = {
  client: PrismaClient;
  user?: User;
};
