import { ApolloContext } from "src/types";

export default {
  Query: {
    lookHashtag: async (
      _: unknown,
      { hashtag }: { hashtag: string },
      { client }: ApolloContext
    ) =>
      client.hashtag.findUnique({
        where: { hashtag },
      }),
  },
};
