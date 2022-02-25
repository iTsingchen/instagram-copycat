import { hash } from "bcrypt";
import { User } from "@prisma/client";
import { FileUpload } from "graphql-upload";

import { hashSaltRounds } from "src/configs";
import { protectedResolver, uploadToGithub } from "src/utils";

export default {
  Mutation: {
    updateProfile: protectedResolver(
      async (
        _: unknown,
        args: Omit<Partial<User>, "avatar"> & { avatar?: Promise<FileUpload> },
        { client, user }
      ) => {
        const { id } = user;
        const { username, password, email, nickname, bio, avatar } = args;

        try {
          const avatarUrl = avatar
            ? await uploadToGithub(avatar, ".instagram/avatars")
            : user.avatar;

          await client.user.update({
            where: { id },
            data: {
              password: password && (await hash(password, hashSaltRounds)),
              username,
              email,
              nickname,
              bio,
              avatar: avatarUrl,
            },
          });

          return {
            ok: true,
          };
        } catch (err) {
          console.log(err);
          return {
            ok: false,
            error: (err as Error).message,
          };
        }
      }
    ),
  },
};
