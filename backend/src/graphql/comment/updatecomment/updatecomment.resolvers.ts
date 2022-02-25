import { protectedResolver } from "src/utils";

export default {
  Mutation: {
    updateComment: protectedResolver(
      async (
        _: unknown,
        { id, payload }: { id: string; payload: string },
        { client, user }
      ) => {
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

        await client.comment.update({ where: { id }, data: { payload } });

        return { ok: true };
      }
    ),
  },
};
