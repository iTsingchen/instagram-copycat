import { ApolloContext } from "src/types";

export default {
  Query: {
    searchUsers: async (
      _: unknown,
      args: { keyword: string },
      { client }: ApolloContext
    ) =>
      client.user.findMany({
        where: {
          username: {
            startsWith: args.keyword.toLocaleLowerCase(),
          },
        },
      }),
  },
};
