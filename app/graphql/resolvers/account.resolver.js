import { GraphQLError } from "graphql";
import { User } from "../../models";
import { signToken } from '../../utils/jwt';

export default {
  Query: {},
  Mutation: {
    signIn: async (obj, { input }, ctx, info) => {
      const { email, password } = input

      const user = await User.findOne({ email })
      const validPassword = await user?.comparePassword(password)

      if (!user || !validPassword) {
        throw new GraphQLError("incorrect email or password")
      }

      const jwt = user.generateJwtToken({ email }, "1d")

      return { jwt, user }
    },
    signUp: async (obj, { input }, ctx, info) => {
      const { email } = input

      const exists = await User.findOne({ email })
      if (!!exists) {
        throw new GraphQLError("email already exists")
      }

      const user = await User.create(input)
      const jwt = signToken({ id: user.id, email })

      return { jwt, user }
    }
  }
}