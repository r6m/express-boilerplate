import { GraphQLError } from "graphql";
import { getDirectives, MapperKind, mapSchema } from "graphql-tools";
import { decodeAndVerifyToken } from "../../utils/jwt";

export const hasRole = () => ({
  hasRoleDirectiveTypeDefs: "directive @hasRole on FIELD_DEFINITION",
  hasRoleDirectiveTransformer: (schema) =>
    mapSchema(schema, {
      [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
        const directives = getDirectives(schema, fieldConfig);
        if (directives['hasRole']) {
          const { roles: expectedRoles } = args
          const { resolve: next } = fieldConfig

          fieldConfig.resolve = async (source, args, context, info) => {
            try {
              const payload = decodeAndVerifyToken(context)

              const roles = payload["roles"] || payload["Roles"] || payload["role"] || payload["Role"]

              if (expectedRoles.some(role => roles.indexOf(role) !== -1)) {
                return next(source, args, { ...context, user: payload }, info)
              }
            } catch (error) {
              throw new GraphQLError("you are not authorized for this resource")
            }
          }

          return fieldConfig
        }
      },
    })
})

