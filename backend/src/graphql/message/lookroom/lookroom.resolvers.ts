import { protectedResolver } from "src/utils";

export default {
  Query: {
    lookRoom: protectedResolver(
      async (_1: unknown, { roomId }: { roomId: string }, { client, user }) =>
        client.room.findFirst({
          where: {
            id: roomId,
            users: {
              some: { id: user.id },
            },
          },
        })
    ),
  },
};
