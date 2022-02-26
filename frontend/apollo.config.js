module.exports = {
  client: {
    includes: ["./src/**/*{ts,tsx,gql}"],
    service: {
      name: "instagram-backend",
      url: "http://localhost:4000/graphql",
    },
  },
};
