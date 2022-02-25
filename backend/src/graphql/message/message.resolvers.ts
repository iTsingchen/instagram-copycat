import { Room, Message } from "@prisma/client";

import { ApolloContext } from "src/types";

export default {
  Room: {
    users: ({ id }: Room, _args: unknown, { client }: ApolloContext) =>
      client.room.findUnique({ where: { id } }).users(),
    messages: ({ id }: Room, _args: unknown, { client }: ApolloContext) =>
      client.message.findMany({
        where: { roomId: id },
      }),
    unreadTotal: (
      { id }: Room,
      _args: unknown,
      { client, user }: ApolloContext
    ) => {
      if (!user) return 0;

      return client.message.count({
        where: {
          roomId: id,
          read: false,

          user: {
            id: {
              not: user.id,
            },
          },
        },
      });
    },
  },

  Message: {
    user: ({ userId }: Message, _args: unknown, { client }: ApolloContext) =>
      client.user.findUnique({ where: { id: userId } }),
  },
};
