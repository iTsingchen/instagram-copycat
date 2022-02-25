import { Comment } from "@prisma/client";

import { protectedResolver } from "src/utils";

export default {
  Mutation: {
    createComment: protectedResolver(
      async (_: unknown, { photoId, payload }: Comment, { client, user }) => {
        const photo = await client.photo.findUnique({
          where: { id: photoId },
          select: {
            id: true,
          },
        });

        if (!photo) {
          return {
            ok: false,
            error: "Photo not found",
          };
        }

        await client.comment.create({
          data: {
            payload,

            user: {
              connect: {
                id: user.id,
              },
            },
            photo: {
              connect: {
                id: photo.id,
              },
            },
          },
        });

        return { ok: true };
      }
    ),
  },
};
