import { protectedResolver } from "src/utils";

export default {
  Query: {
    lookFeed: protectedResolver(
      async (_1: unknown, _2: unknown, { client, user }) =>
        client.photo.findMany({
          where: {
            OR: [
              {
                user: {
                  followers: {
                    some: {
                      id: user.id,
                    },
                  },
                },
              },
              { userId: user.id },
            ],
          },
          orderBy: {
            createdAt: "desc",
          },
        })
    ),
  },
};
