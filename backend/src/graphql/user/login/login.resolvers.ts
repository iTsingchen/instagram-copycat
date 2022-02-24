import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { User } from "@prisma/client";

import { ApolloContext } from "src/types";

export default {
  Mutation: {
    login: async (
      _: unknown,
      args: Pick<User, "username" | "password">,
      { client }: ApolloContext
    ) => {
      const user = await client.user.findUnique({
        where: { username: args.username },
      });

      if (!user) {
        return { ok: false, error: "User is not found." };
      }

      const isMatching = await compare(args.password, user.password);

      if (!isMatching) {
        return { ok: false, error: "Password is incorrect." };
      }

      return {
        ok: true,
        token: sign({ id: user.id }, process.env.SECRET_KEY!),
      };
    },
  },
};
