import { Photo } from "@prisma/client";
import { protectedResolver } from "src/utils";

export default {
  Mutation: {
    toggleLike: protectedResolver(
      async (_: unknown, { id }: Photo, { client, user }) => {
        const photo = await client.photo.findUnique({ where: { id } });
        if (!photo) {
          return { ok: false, error: "Photo not found" };
        }

        const likeWhere = {
          photoId_userId: {
            photoId: photo.id,
            userId: user.id,
          },
        };

        const like = await client.like.findUnique({
          where: likeWhere,
        });

        if (like) {
          await client.like.delete({
            where: likeWhere,
          });
        } else {
          await client.like.create({
            data: {
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
        }

        return { ok: true };
      }
    ),
  },
};
