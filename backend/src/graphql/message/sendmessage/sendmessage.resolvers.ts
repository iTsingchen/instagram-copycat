import { Room } from "@prisma/client";

import { protectedResolver } from "src/utils";
import { NEW_MESSAGE } from "src/defines";

export default {
  Mutation: {
    sendMessage: protectedResolver(
      async (
        _: unknown,
        args: { payload: string; roomId?: string; userId?: string },
        { client, pubsub, user: sendUser }
      ) => {
        const { payload, roomId, userId } = args;

        let room: Pick<Room, "id"> | null = null;
        if (userId) {
          const receiveUser = await client.user.findUnique({
            where: { id: userId },
            select: { id: true },
          });
          if (!receiveUser) {
            return {
              ok: false,
              error: "The receive user is not found.",
            };
          }

          room = await client.room.create({
            data: {
              users: {
                connect: [{ id: receiveUser.id }, { id: sendUser.id }],
              },
            },
          });
        } else {
          room = await client.room.findUnique({
            where: { id: roomId },
            select: { id: true },
          });

          if (!room) {
            return {
              ok: false,
              error: "The room is not found.",
            };
          }
        }

        const message = await client.message.create({
          data: {
            payload,
            user: {
              connect: {
                id: sendUser.id,
              },
            },
            room: {
              connect: {
                id: room.id,
              },
            },
          },
        });

        await pubsub.publish(NEW_MESSAGE, { roomUpdates: message });

        return { ok: true };
      }
    ),
  },
};
