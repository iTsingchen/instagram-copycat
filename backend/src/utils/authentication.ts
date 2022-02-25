import type { PrismaClient, User } from "@prisma/client";
import { verify } from "jsonwebtoken";
import {} from "apollo-server-express";

import { ApolloContext } from "src/types";

export const getUser = async (client: PrismaClient, token?: string) => {
  if (!token) return undefined;

  const verifiedToken = verify(token, process.env.SECRET_KEY!) as {
    id: string;
  };

  if (!verifiedToken?.id) return undefined;

  const user = await client.user.findUnique({
    where: { id: verifiedToken.id },
  });

  return user ?? undefined;
};

type RequiredUserApolloCtx = ApolloContext & { user: User };
type ResolverInfo = { operation: { operation: string } };

type Resolver<P, A, R> = (
  parent: P,
  args: A,
  ctx: RequiredUserApolloCtx,
  info: ResolverInfo
) => Promise<R> | R;

export const protectedResolver =
  <P, A, R>(resolver: Resolver<P, A, R>) =>
  (parent: P, args: A, ctx: ApolloContext, info: ResolverInfo) => {
    const { user } = ctx;

    if (!user) {
      if (info.operation.operation === "query") {
        return null;
      }
      return { ok: false, error: "you must be logged in to query this schema" };
    }

    return resolver(parent, args, ctx as RequiredUserApolloCtx, info);
  };
