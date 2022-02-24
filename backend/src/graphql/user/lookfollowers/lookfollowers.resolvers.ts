import { ApolloContext } from "src/types";

export default {
  Query: {
    lookFollowers: async (
      _: unknown,
      { username, page }: { username: string; page: number },
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
      const followers = await client.user
        .findUnique({
          where: {
            id: user.id,
          },
        })
        .followers({
          take: PAGE_SIZE,
          skip: (page - 1) * PAGE_SIZE,
        });
      const totalFollowers = await client.user.count({
        where: {
          following: {
            some: {
              id: user.id,
            },
          },
        },
      });

      return {
        ok: true,
        followers,
        totalPage: Math.ceil(totalFollowers / PAGE_SIZE),
      };
    },
  },
};
