import { ApolloContext } from "src/types";

export default {
  Query: {
    lookFollowing: async (
      _: unknown,
      { username, lastId }: { username: string; lastId?: string },
      { client }: ApolloContext
    ) => {
      const user = await client.user.findUnique({
        where: { username },
        select: { id: true },
      });

      if (!user) {
        return {
          ok: false,
          error: "User not found",
        };
      }
      const PAGE_SIZE = 5;
      const following = await client.user
        .findUnique({
          where: {
            id: user.id,
          },
        })
        .following({
          take: PAGE_SIZE,
          skip: lastId ? 1 : 0,
          cursor: lastId ? { id: lastId } : undefined,
        });

      return {
        ok: true,
        following,
      };
    },
  },
};
