import jwt from 'jsonwebtoken'

export interface JWTPayload {
  userId: string
  email: string
  username: string
}

export interface DecodedToken extends JWTPayload {
  iat: number
  exp: number
}

const getSecret = (): string => {
  const secret = process.env.MASTER_KEY

  if (!secret) {
    throw new Error(
      'MASTER_KEY environment variable is required for JWT signing'
    )
  }

  return secret
}

export function signToken(
  payload: JWTPayload,
  expiresIn: string = '7d'
): string {
  const secret = getSecret()

  return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions)
}

export function verifyToken(token: string): DecodedToken {
  return jwt.verify(token, getSecret()) as DecodedToken
}

export function refreshToken(token: string): string {
  const decoded = verifyToken(token)

  const { userId, email, username } = decoded

  return signToken({ userId, email, username })
}

export function decodeToken(token: string): DecodedToken | null {
  const decoded = jwt.decode(token)

  return decoded as DecodedToken | null
}
