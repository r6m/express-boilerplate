import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { graphqlHTTP } from 'express-graphql';
import { NoSchemaIntrospectionCustomRule, specifiedRules } from 'graphql';
import { loadFilesSync, makeExecutableSchema } from "graphql-tools";
import { join } from 'path';
import { authDirective } from './directives/auth';
import resolvers from './resolvers';

const { authDirectiveTypeDefs, authDirectiveTransformer } = authDirective()

const typeDefs = loadFilesSync(join(__dirname, 'schema/**/*.graphql'), {
  loaders: [new GraphQLFileLoader()],
})

const schema = makeExecutableSchema({
  typeDefs: [
    ...typeDefs,
    authDirectiveTypeDefs,
  ],
  resolvers,
  schemaTransforms: [authDirectiveTransformer],
})

const productionOptions = {
  graphiql: false,
  validationRules: [...specifiedRules, NoSchemaIntrospectionCustomRule]
}
export const graphql = graphqlHTTP({
  schema: schema,
  graphiql: { headerEditorEnabled: true },
  ...(process.env.NODE_ENV === 'production' ? productionOptions : {}),
})

