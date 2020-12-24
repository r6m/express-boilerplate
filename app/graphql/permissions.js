import { shield, allow, rule } from 'graphql-shield'

const isAuthenticated = rule({ cache: "contextual" })(
  async (parent, args, { user }, info) => {
    if (user) return true;
    return "Not Authorized!";
  }
);

export const permissions = shield({
  Query: {
    "*": isAuthenticated,
  },
  Mutation: {
    "*": isAuthenticated,
  },
}, {
  debug: true,
})
