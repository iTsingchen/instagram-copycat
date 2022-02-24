import { ApolloContext } from "src/types";

export default {
  Query: {
    lookPhoto: async (
      _: unknown,
      { id }: { id: string },
      { client }: ApolloContext
    ) => {
      const photo = await client.photo.findUnique({ where: { id } });
      return photo;
    },
  },
};
