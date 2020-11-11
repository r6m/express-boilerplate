import { mergeResolvers } from "graphql-tools";
import account from "./account.resolver";

const resolvers = [
  account,
]

module.exports = mergeResolvers(resolvers)