import { User } from "@prisma/client";

import { ApolloContext } from "src/types";

export default {
  User: {
    totalFollowers: async (
      parent: User,
      _: unknown,
      { client }: ApolloContext
    ) => {
      const totalFollowers = await client.user.count({
        where: { following: { some: { id: parent.id } } },
      });

      return totalFollowers;
    },
    totalFollowing: async (
      parent: User,
      _: unknown,
      { client }: ApolloContext
    ) => {
      const totalFollowing = await client.user.count({
        where: { followers: { some: { id: parent.id } } },
      });

      return totalFollowing;
    },
    isFollowing: async (
      parent: User,
      _: unknown,
      { client, user }: ApolloContext
    ) => {
      if (!user) return false;
      const count = await client.user.count({
        where: { id: user.id, following: { some: { id: parent.id } } },
      });

      return count === 1;
    },
    isMe: (parent: User, _: unknown, { user }: ApolloContext) => {
      if (!user) return false;

      return parent.id === user.id;
    },

    photos: async (
      { id }: User,
      { page }: { page: number },
      { client }: ApolloContext
    ) => {
      const PAGE_SIZE = 10;
      const photos = await client.photo.findMany({
        where: { userId: id },
        take: PAGE_SIZE,
        skip: Math.max(0, page - 1) * PAGE_SIZE,
      });

      return photos;
    },
  },
};
