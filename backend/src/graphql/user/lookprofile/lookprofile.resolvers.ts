import { ApolloContext } from "src/types";

export default {
  Query: {
    lookProfile: async (
      _: unknown,
      { username }: { username: string },
      { client }: ApolloContext
    ) => {
      const user = await client.user.findUnique({ where: { username } });
      return user;
    },
  },
};
