import { protectedResolver } from "src/utils";

export default {
  Mutation: {
    deletePhoto: protectedResolver(
      async (_: unknown, { id }: { id: string }, { client, user }) => {
        const photo = await client.photo.findUnique({
          where: { id },
          select: {
            userId: true,
          },
        });

        if (!photo) {
          return {
            ok: false,
            error: "No found photo with id.",
          };
        }
        if (photo.userId !== user.id) {
          return {
            ok: false,
            error: "No permission.",
          };
        }

        await client.photo.delete({ where: { id } });

        return { ok: true };
      }
    ),
  },
};
