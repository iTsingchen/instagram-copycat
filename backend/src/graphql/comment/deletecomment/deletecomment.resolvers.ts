import { protectedResolver } from "src/utils";

export default {
  Mutation: {
    deleteComment: protectedResolver(
      async (_: unknown, { id }: { id: string }, { client, user }) => {
        const comment = await client.comment.findUnique({
          where: { id },
          select: {
            userId: true,
          },
        });

        if (!comment) {
          return {
            ok: false,
            error: "No found comment with id.",
          };
        }
        if (comment.userId !== user.id) {
          return {
            ok: false,
            error: "No permission.",
          };
        }

        await client.comment.delete({ where: { id } });

        return { ok: true };
      }
    ),
  },
};
