import { Message } from "@prisma/client";
import { withFilter } from "graphql-subscriptions";

import { protectedResolver } from "src/utils";
import { NEW_MESSAGE } from "src/defines";

export default {
  Subscription: {
    roomUpdates: {
      subscribe: protectedResolver(
        async (
          parent: unknown,
          args: { roomId: string },
          ctx,
          info: unknown
        ) => {
          const { client, user, pubsub } = ctx;

          const checkPermission = async () => {
            const room = await client.room.findFirst({
              where: {
                id: args.roomId,
                users: {
                  some: {
                    id: user.id,
                  },
                },
              },
              select: { id: true },
            });

            return !!room;
          };

          if (!(await checkPermission())) {
            throw new Error("Room not found");
          }

          const resolverFn = withFilter(
            () => {
              return pubsub.asyncIterator(NEW_MESSAGE);
            },
            async (
              payload: { roomUpdates: Message },
              { roomId }: { roomId: string }
            ) =>
              payload.roomUpdates.roomId === roomId && (await checkPermission())
          );

          return resolverFn(parent, args, ctx, info);
        }
      ),
    },
  },
};
