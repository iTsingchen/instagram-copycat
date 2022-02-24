import { protectedResolver, extractHashtags } from "src/utils";

export default {
  Mutation: {
    uploadPhoto: protectedResolver(
      async (
        _: unknown,
        { file, caption }: { file: string; caption?: string },
        { client, user }
      ) => {
        const photo = await client.photo.create({
          data: {
            file,
            caption,

            user: {
              connect: {
                id: user.id,
              },
            },

            hashtags: {
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
