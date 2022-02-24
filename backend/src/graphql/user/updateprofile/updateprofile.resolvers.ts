import { createWriteStream } from "fs";
import { join } from "path";
import { hash } from "bcrypt";
import { User } from "@prisma/client";
import { FileUpload } from "graphql-upload";

import { hashSaltRounds } from "src/configs";
import { protectedResolver } from "src/utils";

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

        let avatarPath = user.avatar;
        if (avatar) {
          const fileLoad = await avatar;
          const randomStr = () => Math.random().toString(16).slice(2);
          avatarPath = join(
            "public",
            "__upload__",
            `${user.id}_${randomStr()}_${fileLoad.filename}`
          );

          const readStream = fileLoad.createReadStream();
          const writeStream = createWriteStream(
            join(process.cwd(), avatarPath)
          );
          readStream.pipe(writeStream);
        }

        try {
          await client.user.update({
            where: { id },
            data: {
              password: password && (await hash(password, hashSaltRounds)),
              username,
              email,
              nickname,
              bio,
              avatar: avatarPath,
            },
          });

          return {
            ok: true,
          };
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
