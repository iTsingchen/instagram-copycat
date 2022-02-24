import { User } from "@prisma/client";

import { protectedResolver } from "src/utils";

export default {
  Mutation: {
    followUser: protectedResolver(
      async (_: unknown, args: Pick<User, "username">, { client, user }) => {
        const { username } = args;

        const followedUser = await client.user.findUnique({
          where: { username },
        });

        if (!followedUser) {
          return {
            ok: false,
            error: "That username doesn't exist.",
          };
        }

        await client.user.update({
          where: { id: user.id },
          data: {
            following: {
              connect: { id: followedUser.id },
            },
          },
        });

        return { ok: true };
      }
    ),
  },
};
