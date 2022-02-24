import { GraphQLUpload } from "graphql-upload";

// https://www.apollographql.com/docs/apollo-server/data/file-uploads/
export default {
  // This maps the `Upload` scalar to the implementation provided
  // by the `graphql-upload` package.
  Upload: GraphQLUpload,
};
