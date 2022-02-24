import { Photo } from "@prisma/client";

import { ApolloContext } from "src/types";

export default {
  Query: {
    lookPhotoLikes: async (
      _: unknown,
      { id }: Photo,
      { client }: ApolloContext
    ) => {
      const likes = await client.like.findMany({
        where: {
          photoId: id,
        },
        select: {
          user: true,
        },
      });

      return likes.map((like) => like.user);
    },
  },
};
