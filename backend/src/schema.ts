import path from "path";
import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge";
import { makeExecutableSchema } from "@graphql-tools/schema";

const typesArray = loadFilesSync(path.join(__dirname, "graphql/**/*.gql"));
const resolversArray = loadFilesSync(
  path.join(__dirname, "graphql/**/*.resolvers.ts")
);
const typeDefs = mergeTypeDefs(typesArray);
const resolvers = mergeResolvers(resolversArray);

export const schema = makeExecutableSchema({ typeDefs, resolvers });
