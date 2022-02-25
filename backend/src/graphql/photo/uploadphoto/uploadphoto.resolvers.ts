import { FileUpload } from "graphql-upload";

import { protectedResolver, extractHashtags, uploadToGithub } from "src/utils";

export default {
  Mutation: {
    uploadPhoto: protectedResolver(
      async (
        _: unknown,
        { file, caption }: { file: Promise<FileUpload>; caption?: string },
        { client, user }
      ) => {
        try {
          const fileUrl = await uploadToGithub(file, ".instagram/photos");
          await client.photo.create({
            data: {
              file: fileUrl,
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

          return { ok: true };
        } catch (err) {
          return {
            ok: false,
            error: (err as Error).message,
          };
        }
      }
    ),
  },
};
