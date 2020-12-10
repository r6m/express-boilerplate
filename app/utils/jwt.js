import jwt from 'jsonwebtoken'

export const jwtConfig = {
  secretKey: process.env.JWT_SECRET || 'defaultsecret',
  issuer: 'issuer',
  audience: "audience",
  algorithm: "HS512",
}

export const signToken = (payload = {}, expiresIn = "1d") => {
  const { userId } = payload
  const { secretKey, ...options } = jwtConfig

  return jwt.sign(payload, secretKey, {
    ...options,
    ...(userId && { subject: userId }),
    expiresIn,
  })
}

export const verifyToken = (token) => {
  return jwt.verify(token, jwtConfig.secretKey, { algorithms: ["HS512"] })
}

export const decodeAndVerifyToken = (context) => {
  const authorization = context?.headers?.authorization
  if (!authorization) {
    throw new GraphQLError("please provide authorization token");
  }

  const token = authorization.replace("Bearer ", "")
  return verifyToken(token)
}