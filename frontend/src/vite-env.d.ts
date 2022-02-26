/// <reference types="vite/client" />

declare module "*.gql" {
  import { DocumentNode } from "graphql";

  const Schema: DocumentNode;

  export = Schema;
}
