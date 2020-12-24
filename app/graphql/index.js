import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { graphqlHTTP } from 'express-graphql';
import { NoSchemaIntrospectionCustomRule, specifiedRules } from 'graphql';
import { loadFilesSync, makeExecutableSchema } from "graphql-tools";
import { applyMiddleware } from 'graphql-middleware'
import { join } from 'path';
import { User } from '../models';
import resolvers from './resolvers';
import { verifyToken } from '../utils/jwt';
import { permissions } from './permissions'
import { authDirective } from './directives/auth';

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

const schemaWithMiddleware = applyMiddleware(
  schema,
  permissions
)

const productionOptions = {
  graphiql: false,
  validationRules: [...specifiedRules, NoSchemaIntrospectionCustomRule]
}

const prepareContext = async (req) => {
  const authorization = req.headers.authorization

  if (authorization) {
    const token = authorization.replace("Bearer ", "")
    try {
      const { sub } = verifyToken(token)
      const user = await User.findById(sub)
      return {
        user: user,
        userId: user?.id
      }
    } catch (error) {
      console.log("graphql:prepareContext", error.message)
    }
  }
  return {}
}

export const graphql = async (req, res, next) => {
  const context = await prepareContext(req)

  graphqlHTTP({
    schema: schemaWithMiddleware,
    graphiql: true,
    context,
    ...(process.env.NODE_ENV === 'production' ? productionOptions : {}),
  })(req, res)
}
