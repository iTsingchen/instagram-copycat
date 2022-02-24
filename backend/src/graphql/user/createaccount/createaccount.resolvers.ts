import { hash } from "bcrypt";
import { User } from "@prisma/client";

import { ApolloContext } from "src/types";
import { hashSaltRounds } from "src/configs";

export default {
  Mutation: {
    createAccount: async (
      _: unknown,
      args: User,
      { client }: ApolloContext
    ) => {
      const { username, password, email, nickname, bio } = args;
      try {
        // 1. 检查 username 与 email 是否已经被占用
        const existing = await client.user.findFirst({
          where: {
            OR: [{ username }, { email }],
          },
        });

        if (existing) {
          throw new Error("Username or email is already occupied.");
        }

        // 2. 创建账户
        await client.user.create({
          data: {
            username,
            email,
            nickname,
            bio,
            password: await hash(password, hashSaltRounds), // 密码加密
          },
        });

        return {
          ok: true,
        };
      } catch (err) {
        return err;
      }
    },
  },
};
