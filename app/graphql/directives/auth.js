import { GraphQLError } from "graphql";
import { getDirectives, MapperKind, mapSchema } from "graphql-tools";
import { verifyToken } from "../../utils/jwt";

export const authDirective = () => ({
  authDirectiveTypeDefs: "directive @auth on FIELD_DEFINITION",
  authDirectiveTransformer: (schema) =>
    mapSchema(schema, {
      [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
        const directives = getDirectives(schema, fieldConfig);
        if (directives['auth']) {
          const { resolve: defaultResolver } = fieldConfig

          fieldConfig.resolve = async (source, args, context, info) => {
            const authorization = context?.headers?.authorization
            if (!authorization) {
              throw new GraphQLError("please provide authorization token");
            }

            try {
              const token = authorization.replace("Bearer ", "")
              const { id } = verifyToken(token)

              const result = await defaultResolver(source, args, { ...context, userId: id }, info)
              return result

            } catch (error) {
              console.log(error)
              throw new GraphQLError("you are not authorized for this action");
            }
          }

          return fieldConfig
        }
      },
    })
})

