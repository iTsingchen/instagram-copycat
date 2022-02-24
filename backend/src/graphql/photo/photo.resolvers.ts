import { Photo, Hashtag } from "@prisma/client";

import { ApolloContext } from "src/types";

export default {
  Photo: {
    user: async ({ userId }: Photo, _: unknown, { client }: ApolloContext) => {
      const user = await client.user.findUnique({ where: { id: userId } });

      return user;
    },

    hashtags: async ({ id }: Photo, _: unknown, { client }: ApolloContext) => {
      const user = await client.hashtag.findMany({
        where: {
          photos: {
            some: { id },
          },
        },
      });

      return user;
    },
  },

  Hashtag: {
    totalPhotos: async (
      { id }: Hashtag,
      _: unknown,
      { client }: ApolloContext
    ) => {
      const total = await client.photo.count({
        where: { hashtags: { some: { id } } },
      });

      return total;
    },

    photos: async (
      { id }: Hashtag,
      { page }: { page: number },
      { client }: ApolloContext
    ) => {
      const PAGE_SIZE = 10;
      const photos = await client.photo.findMany({
        where: { hashtags: { some: { id } } },
        take: PAGE_SIZE,
        skip: Math.max(0, page - 1) * PAGE_SIZE,
      });

      return photos;
    },
  },
};
