import { Photo } from "@prisma/client";
import { protectedResolver, extractHashtags } from "src/utils";

export default {
  Mutation: {
    updatePhoto: protectedResolver(
      async (
        _: unknown,
        { id, caption }: Pick<Photo, "id" | "caption">,
        { client, user }
      ) => {
        const oldPhoto = await client.photo.findUnique({
          where: {
            id,
          },
          select: {
            userId: true,
            hashtags: {
              select: {
                hashtag: true,
              },
            },
          },
        });
        if (!oldPhoto || oldPhoto.userId !== user.id) {
          return { ok: false, error: "Photo not found" };
        }

        const photo = await client.photo.update({
          where: { id },
          data: {
            caption,
            hashtags: {
              disconnect: oldPhoto.hashtags,
              connectOrCreate: extractHashtags(caption).map((hashtag) => ({
                where: hashtag,
                create: hashtag,
              })),
            },
          },
        });

        return { ok: true, photo };
      }
    ),
  },
};
