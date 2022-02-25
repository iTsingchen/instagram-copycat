import { protectedResolver } from "src/utils";

export default {
  Query: {
    lookRooms: protectedResolver(
      async (_1: unknown, _2: unknown, { client, user }) =>
        client.room.findMany({
          where: {
            users: {
              some: { id: user.id },
            },
          },
        })
    ),
  },
};
