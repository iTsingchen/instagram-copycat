import { ApolloContext } from "src/types";

export default {
  Query: {
    searchPhotos: async (
      _: unknown,
      args: { keyword: string },
      { client }: ApolloContext
    ) =>
      client.photo.findMany({
        where: {
          caption: {
            contains: args.keyword.toLocaleLowerCase(),
          },
        },
      }),
  },
};
