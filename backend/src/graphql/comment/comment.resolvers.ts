import { Comment } from "@prisma/client";

import { ApolloContext } from "src/types";

export default {
  Comment: {
    isMine: ({ userId }: Comment, _: unknown, { user }: ApolloContext) =>
      user ? user.id === userId : false,
  },
};
