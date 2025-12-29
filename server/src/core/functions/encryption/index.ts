/**
 * @fileoverview Hybrid RSA-AES Encryption for Forge API
 *
 * This module implements a hybrid encryption scheme for securing API request/response data:
 * 1. Client generates a random AES key for each request
 * 2. Client encrypts the AES key using server's RSA public key
 * 3. Client encrypts the request body using AES-GCM
 * 4. Server decrypts the AES key using its RSA private key
 * 5. Server decrypts the request body using the AES key
 * 6. Server encrypts the response using the same AES key
 * 7. Client decrypts the response using the same AES key
 *
 * This approach provides:
 * - End-to-end encryption on top of HTTPS
 * - Forward secrecy (each request uses a unique AES key)
 * - No client-side private key storage needed
 * - Protection against proxy/log interception
 */
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'

// Key storage paths
const KEYS_DIR = path.join(import.meta.dirname, 'keys')

const PRIVATE_KEY_PATH = path.join(KEYS_DIR, 'server_private.pem')

const PUBLIC_KEY_PATH = path.join(KEYS_DIR, 'server_public.pem')

// Encryption settings
const RSA_KEY_SIZE = 2048

const AES_ALGORITHM = 'aes-256-gcm'

const AES_KEY_LENGTH = 32 // 256 bits

const IV_LENGTH = 12 // 96 bits for GCM

const AUTH_TAG_LENGTH = 16 // 128 bits

export interface EncryptedPayload {
  /** RSA-encrypted AES key (base64) */
  k: string
  /** Initialization vector (base64) */
  iv: string
  /** AES-GCM encrypted data (base64) */
  data: string
  /** AES-GCM auth tag (base64) */
  tag: string
}

export interface EncryptedResponse {
  /** Initialization vector (base64) */
  iv: string
  /** AES-GCM encrypted data (base64) */
  data: string
  /** AES-GCM auth tag (base64) */
  tag: string
}

/**
 * Ensures the RSA keypair exists, generating if needed.
 * Should be called during server startup.
 */
export function ensureKeysExist(): void {
  if (!fs.existsSync(KEYS_DIR)) {
    fs.mkdirSync(KEYS_DIR, { recursive: true })
  }

  if (!fs.existsSync(PRIVATE_KEY_PATH) || !fs.existsSync(PUBLIC_KEY_PATH)) {
    console.log('[Encryption] Generating new RSA keypair...')

    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: RSA_KEY_SIZE,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
      }
    })

    fs.writeFileSync(PUBLIC_KEY_PATH, publicKey)
    fs.writeFileSync(PRIVATE_KEY_PATH, privateKey, { mode: 0o600 })
    console.log('[Encryption] RSA keypair generated successfully')
  }
}

/**
 * Gets the server's public key in PEM format.
 * This should be exposed to clients for encrypting their AES keys.
 */
export function getPublicKey(): string {
  if (!fs.existsSync(PUBLIC_KEY_PATH)) {
    ensureKeysExist()
  }

  return fs.readFileSync(PUBLIC_KEY_PATH, 'utf8')
}

/**
 * Gets the server's private key in PEM format.
 * Used internally for decrypting client AES keys.
 */
function getPrivateKey(): string {
  if (!fs.existsSync(PRIVATE_KEY_PATH)) {
    ensureKeysExist()
  }

  return fs.readFileSync(PRIVATE_KEY_PATH, 'utf8')
}

/**
 * Decrypts an RSA-encrypted AES key using the server's private key.
 *
 * @param encryptedKey - Base64-encoded RSA-encrypted AES key
 * @returns The decrypted AES key as a Buffer
 */
export function decryptAESKey(encryptedKey: string): Buffer {
  const privateKey = getPrivateKey()

  const keyBuffer = Buffer.from(encryptedKey, 'base64')

  return crypto.privateDecrypt(
    {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256'
    },
    keyBuffer
  )
}

/**
 * Decrypts AES-GCM encrypted data using the provided key.
 *
 * @param encryptedData - Base64-encoded encrypted data
 * @param key - The AES key as a Buffer
 * @param iv - Base64-encoded initialization vector
 * @param authTag - Base64-encoded authentication tag
 * @returns The decrypted plaintext string
 */
export function decryptAESData(
  encryptedData: string,
  key: Buffer,
  iv: string,
  authTag: string
): string {
  const ivBuffer = Buffer.from(iv, 'base64')

  const dataBuffer = Buffer.from(encryptedData, 'base64')

  const tagBuffer = Buffer.from(authTag, 'base64')

  const decipher = crypto.createDecipheriv(AES_ALGORITHM, key, ivBuffer)

  decipher.setAuthTag(tagBuffer)

  let decrypted = decipher.update(dataBuffer, undefined, 'utf8')
  decrypted += decipher.final('utf8')

  return decrypted
}

/**
 * Encrypts data using AES-GCM with the provided key.
 *
 * @param data - The plaintext data to encrypt
 * @param key - The AES key as a Buffer
 * @returns Encrypted response with iv, data, and tag
 */
export function encryptAESData(data: string, key: Buffer): EncryptedResponse {
  const iv = crypto.randomBytes(IV_LENGTH)

  const cipher = crypto.createCipheriv(AES_ALGORITHM, key, iv)

  let encrypted = cipher.update(data, 'utf8', 'base64')
  encrypted += cipher.final('base64')

  const authTag = cipher.getAuthTag()

  return {
    iv: iv.toString('base64'),
    data: encrypted,
    tag: authTag.toString('base64')
  }
}

/**
 * Decrypts a complete encrypted payload from the client.
 *
 * @param payload - The encrypted payload containing k, iv, data, and tag
 * @returns The decrypted data as a parsed object
 */
export function decryptPayload<T = unknown>(payload: EncryptedPayload): T {
  // Step 1: Decrypt the AES key using RSA private key
  const aesKey = decryptAESKey(payload.k)

  // Step 2: Decrypt the data using AES key
  const decryptedJson = decryptAESData(
    payload.data,
    aesKey,
    payload.iv,
    payload.tag
  )

  // Step 3: Parse and return the decrypted data
  return JSON.parse(decryptedJson) as T
}

/**
 * Encrypts a response using the previously decrypted AES key.
 *
 * @param data - The data to encrypt
 * @param aesKey - The AES key (should be the same key used by the client)
 * @returns Encrypted response payload
 */
export function encryptResponse<T>(data: T, aesKey: Buffer): EncryptedResponse {
  // Handle undefined/null - convert to null for JSON serialization
  const jsonData = JSON.stringify(data ?? null)

  return encryptAESData(jsonData, aesKey)
}

/**
 * Validates if a payload is an encrypted payload structure.
 */
export function isEncryptedPayload(
  payload: unknown
): payload is EncryptedPayload {
  if (typeof payload !== 'object' || payload === null) return false

  const p = payload as Record<string, unknown>

  return (
    typeof p.k === 'string' &&
    typeof p.iv === 'string' &&
    typeof p.data === 'string' &&
    typeof p.tag === 'string'
  )
}

/**
 * Gets encryption configuration including key length and algorithm info.
 * Useful for client-side validation.
 */
export function getEncryptionConfig() {
  return {
    rsaKeySize: RSA_KEY_SIZE,
    aesAlgorithm: AES_ALGORITHM,
    aesKeyLength: AES_KEY_LENGTH,
    ivLength: IV_LENGTH,
    authTagLength: AUTH_TAG_LENGTH
  }
}

export { AES_KEY_LENGTH, IV_LENGTH }
