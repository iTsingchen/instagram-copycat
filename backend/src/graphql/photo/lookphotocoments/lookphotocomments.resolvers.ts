import { ApolloContext } from "src/types";

export default {
  Query: {
    lookPhotoComments: async (
      _: unknown,
      { photoId, page }: { photoId: string; page: number },
      { client }: ApolloContext
    ) => {
      const PAGE_SIZE = 20;
      const comments = await client.comment.findMany({
        where: {
          photoId,
        },

        take: PAGE_SIZE,
        skip: Math.max(0, page - 1) * PAGE_SIZE,

        orderBy: {
          createdAt: "asc",
        },
      });

      return comments;
    },
  },
};
