import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'defaultsecret'

export const signToken = (payload = {}, expiresIn = "1d") => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn,
    algorithm: "HS512",
  })
}

export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET, { algorithms: ["HS512"] })
}

export const decodeAndVerifyToken = (context) => {
  const authorization = context?.headers?.authorization
  if (!authorization) {
    throw new GraphQLError("please provide authorization token");
  }

  const token = authorization.replace("Bearer ", "")
  return verifyToken(token)
}