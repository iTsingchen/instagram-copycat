import { protectedResolver } from "src/utils";

export default {
  Mutation: {
    readMessage: protectedResolver(
      async (_: unknown, { id }: { id: string }, { client, user }) => {
        const message = await client.message.findFirst({
          where: {
            id,

            user: {
              id: {
                not: user.id,
              },
            },

            room: {
              users: {
                some: {
                  id: user.id,
                },
              },
            },
          },
        });

        if (!message) {
          return {
            ok: false,
            error: "Message is not found.",
          };
        }

        await client.message.update({
          where: { id },
          data: {
            read: true,
          },
        });

        return { ok: true };
      }
    ),
  },
};
