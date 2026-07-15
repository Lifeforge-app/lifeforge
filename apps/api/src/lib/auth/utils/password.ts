import { hash, verify } from 'argon2'

export async function hashPassword(password: string): Promise<string> {
  return hash(password, { type: 2 })
}

export async function verifyPassword(
  hash: string,
  password: string
): Promise<boolean> {
  try {
    return await verify(hash, password)
  } catch {
    return false
  }
}
