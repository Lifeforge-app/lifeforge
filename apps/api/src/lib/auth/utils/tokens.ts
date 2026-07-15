import jwt from 'jsonwebtoken'
import crypto from 'node:crypto'

export const JWT_SECRET = process.env.JWT_SIGNING_KEY!

if (!JWT_SECRET) {
  throw new Error(
    'No JWT_SECRET_KEY found. Please make sure it is set in environment variable.'
  )
}

export const ACCESS_TOKEN_DURATION = 15 * 60 // 15 minutes in seconds

export const REFRESH_TOKEN_BYTES = 64 // 512-bit

export const REFRESH_TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

export const MAX_SESSION_AGE_MS = 60 * 24 * 60 * 60 * 1000 // 60 days

export interface AccessTokenPayload {
  sub: string
  jti: string
  iat: number
  exp: number
}

export function signAccessToken(userId: string): string {
  return jwt.sign({ sub: userId, jti: crypto.randomUUID() }, JWT_SECRET, {
    algorithm: 'HS512',
    expiresIn: ACCESS_TOKEN_DURATION
  })
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, JWT_SECRET, {
    algorithms: ['HS512']
  }) as AccessTokenPayload
}

export function generateRefreshToken(): string {
  return crypto.randomBytes(REFRESH_TOKEN_BYTES).toString('base64url')
}

export function generateFamily(): string {
  return crypto.randomUUID()
}

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex')
}

export function getRefreshTokenExpiry(): number {
  return Date.now() + REFRESH_TOKEN_EXPIRY_MS
}

export function getMaxSessionExpiry(): number {
  return Date.now() + MAX_SESSION_AGE_MS
}
