/**
 * @fileoverview Client-side encryption utilities for Forge API
 *
 * This module provides RSA + AES hybrid encryption for securing API requests:
 * 1. Generate random AES key + IV for each request
 * 2. Encrypt AES key with server's RSA public key
 * 3. Encrypt request body with AES-GCM
 * 4. Decrypt response (also encrypted with same AES key)
 *
 * All crypto operations use the Web Crypto API for security.
 */
// ============================================
// Passphrase-based encryption (AES-256-GCM)
//
// Matches the server's `encrypt` / `decrypt` in
// `apps/api/src/core/functions/auth/encryption.ts`:
//
//   key    = SHA-256(passphrase)
//   payload = "v2:" + base64( iv[12] || tag[16] || ciphertext )
//
// These helpers are async because Web Crypto is async. Call sites must await.
// ============================================

const PASSPHRASE_PREFIX = 'v2:'
const GCM_IV_LENGTH = 12
const GCM_TAG_LENGTH = 16

async function derivePassphraseKey(passphrase: string): Promise<CryptoKey> {
  const keyBytes = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(String(passphrase))
  )

  return crypto.subtle.importKey('raw', keyBytes, { name: 'AES-GCM' }, false, [
    'encrypt',
    'decrypt'
  ])
}

export async function encrypt(text: string, key: string): Promise<string> {
  const cryptoKey = await derivePassphraseKey(key)

  const iv = crypto.getRandomValues(new Uint8Array(GCM_IV_LENGTH))

  const sealed = new Uint8Array(
    await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv, tagLength: GCM_TAG_LENGTH * 8 },
      cryptoKey,
      new TextEncoder().encode(text)
    )
  )

  // Web Crypto appends the tag to the ciphertext; the server expects
  // iv || tag || ciphertext.
  const ciphertext = sealed.slice(0, sealed.length - GCM_TAG_LENGTH)

  const tag = sealed.slice(sealed.length - GCM_TAG_LENGTH)

  const payload = new Uint8Array(iv.length + tag.length + ciphertext.length)

  payload.set(iv, 0)
  payload.set(tag, iv.length)
  payload.set(ciphertext, iv.length + tag.length)

  return PASSPHRASE_PREFIX + arrayBufferToBase64(payload.buffer)
}

export async function decrypt(payload: string, key: string): Promise<string> {
  if (!payload.startsWith(PASSPHRASE_PREFIX)) {
    throw new Error('Unsupported encrypted value: expected a v2 payload')
  }

  const bytes = base64ToUint8Array(payload.slice(PASSPHRASE_PREFIX.length))

  const iv = new Uint8Array(bytes.subarray(0, GCM_IV_LENGTH))

  const tag = new Uint8Array(
    bytes.subarray(GCM_IV_LENGTH, GCM_IV_LENGTH + GCM_TAG_LENGTH)
  )

  const ciphertext = new Uint8Array(
    bytes.subarray(GCM_IV_LENGTH + GCM_TAG_LENGTH)
  )

  const sealed = new Uint8Array(ciphertext.length + tag.length)

  sealed.set(ciphertext, 0)
  sealed.set(tag, ciphertext.length)

  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv, tagLength: GCM_TAG_LENGTH * 8 },
    await derivePassphraseKey(key),
    sealed
  )

  return new TextDecoder().decode(decrypted)
}

// ============================================
// RSA + AES Hybrid Encryption
// ============================================

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

export interface EncryptionConfig {
  rsaKeySize: number
  aesAlgorithm: string
  aesKeyLength: number
  ivLength: number
  authTagLength: number
}

// Store the server public key after fetching
let cachedServerPublicKey: CryptoKey | null = null
let cachedServerPublicKeyPem: string | null = null

/**
 * Imports a PEM-encoded RSA public key for use with Web Crypto API.
 */
async function importRSAPublicKey(pemKey: string): Promise<CryptoKey> {
  // Remove PEM headers and decode base64
  const pemHeader = '-----BEGIN PUBLIC KEY-----'

  const pemFooter = '-----END PUBLIC KEY-----'

  const pemContents = pemKey
    .replace(pemHeader, '')
    .replace(pemFooter, '')
    .replace(/\s/g, '')

  const binaryDer = Uint8Array.from(atob(pemContents), c => c.charCodeAt(0))

  return await crypto.subtle.importKey(
    'spki',
    binaryDer.buffer,
    {
      name: 'RSA-OAEP',
      hash: 'SHA-256'
    },
    false,
    ['encrypt']
  )
}

/**
 * Sets the server's public key for encryption.
 * Call this once after fetching from /encryptionPublicKey endpoint.
 */
export async function setServerPublicKey(pemKey: string): Promise<void> {
  if (cachedServerPublicKeyPem === pemKey && cachedServerPublicKey) {
    return // Already cached
  }

  cachedServerPublicKey = await importRSAPublicKey(pemKey)
  cachedServerPublicKeyPem = pemKey
}

/**
 * Checks if the server public key is cached.
 */
export function hasServerPublicKey(): boolean {
  return cachedServerPublicKey !== null
}

/**
 * Clears the cached server public key.
 */
export function clearServerPublicKey(): void {
  cachedServerPublicKey = null
  cachedServerPublicKeyPem = null
}

/**
 * Initializes end-to-end encryption by fetching the server's public key.
 * Call this once at app startup before making any encrypted API requests.
 *
 * @param apiHost The base URL of the API server
 * @returns Promise that resolves when encryption is ready
 * @throws Error if the public key cannot be fetched
 */
export async function initializeEncryption(apiHost: string): Promise<void> {
  try {
    const response = await fetch(`${apiHost}/encryptionPublicKey`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch public key: ${response.status}`)
    }

    const result = await response.json()

    const publicKey = result.data || result

    if (!publicKey) {
      throw new Error('No public key in response')
    }

    await setServerPublicKey(publicKey)
  } catch (error) {
    console.error('Failed to initialize encryption:', error)
    throw error
  }
}

/**
 * Generates a random AES-256 key.
 */
async function generateAESKey(): Promise<CryptoKey> {
  return await crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256
    },
    true, // extractable
    ['encrypt', 'decrypt']
  )
}

/**
 * Exports an AES key to raw bytes.
 */
async function exportAESKey(key: CryptoKey): Promise<ArrayBuffer> {
  return await crypto.subtle.exportKey('raw', key)
}

/**
 * Encrypts the AES key using the server's RSA public key.
 */
async function encryptAESKeyWithRSA(aesKey: CryptoKey): Promise<string> {
  if (!cachedServerPublicKey) {
    throw new Error(
      'Server public key not set. Call setServerPublicKey() first.'
    )
  }

  const rawKey = await exportAESKey(aesKey)

  const encrypted = await crypto.subtle.encrypt(
    {
      name: 'RSA-OAEP'
    },
    cachedServerPublicKey,
    rawKey
  )

  return arrayBufferToBase64(encrypted)
}

/**
 * Encrypts data using AES-GCM.
 */
async function encryptWithAES(
  data: string,
  key: CryptoKey
): Promise<{ iv: string; ciphertext: string; tag: string }> {
  const encoder = new TextEncoder()

  const dataBytes = encoder.encode(data)

  // Generate random IV (96 bits for GCM)
  const iv = crypto.getRandomValues(new Uint8Array(12))

  const encrypted = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
      tagLength: 128 // 128-bit auth tag
    },
    key,
    dataBytes
  )

  // Web Crypto API appends the auth tag to the ciphertext
  // We need to split them: last 16 bytes are the tag
  const encryptedArray = new Uint8Array(encrypted)

  const ciphertextLength = encryptedArray.length - 16

  const ciphertext = encryptedArray.slice(0, ciphertextLength)

  const tag = encryptedArray.slice(ciphertextLength)

  return {
    iv: arrayBufferToBase64(iv.buffer),
    ciphertext: arrayBufferToBase64(ciphertext.buffer),
    tag: arrayBufferToBase64(tag.buffer)
  }
}

/**
 * Decrypts data using AES-GCM.
 */
async function decryptWithAES(
  ciphertext: string,
  iv: string,
  tag: string,
  key: CryptoKey
): Promise<string> {
  const ciphertextBytes = base64ToUint8Array(ciphertext)

  const ivBytes = base64ToUint8Array(iv)

  const tagBytes = base64ToUint8Array(tag)

  // Combine ciphertext and tag (Web Crypto expects them together)
  const combined = new Uint8Array(ciphertextBytes.length + tagBytes.length)

  combined.set(ciphertextBytes, 0)
  combined.set(tagBytes, ciphertextBytes.length)

  const decrypted = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: ivBytes as Uint8Array<ArrayBuffer>,
      tagLength: 128
    },
    key,
    combined
  )

  const decoder = new TextDecoder()

  return decoder.decode(decrypted)
}

/**
 * Helper: Convert ArrayBuffer to base64 string.
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)

  let binary = ''

  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]!)
  }

  return btoa(binary)
}

/**
 * Helper: Convert base64 string to Uint8Array.
 */
function base64ToUint8Array(base64: string): Uint8Array {
  const binary = atob(base64)

  const bytes = new Uint8Array(binary.length)

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }

  return bytes
}

// ============================================
// Session-based encryption
// ============================================

interface EncryptionSession {
  aesKey: CryptoKey
  aesKeyRaw: ArrayBuffer
}

/**
 * Creates an encryption session for GET requests.
 * Returns an encrypted AES key to send in header and a session for decrypting the response.
 */
export async function createEncryptionSession(): Promise<{
  encryptedKey: string
  session: EncryptionSession
}> {
  if (!cachedServerPublicKey) {
    throw new Error(
      'Server public key not set. Call setServerPublicKey() first.'
    )
  }

  // Generate a new AES key for this request
  const aesKey = await generateAESKey()

  const aesKeyRaw = await exportAESKey(aesKey)

  // Encrypt the AES key with server's RSA public key
  const encryptedKey = await encryptAESKeyWithRSA(aesKey)

  return {
    encryptedKey,
    session: {
      aesKey,
      aesKeyRaw
    }
  }
}

/**
 * Creates an encrypted payload for an API request.
 * Returns the encrypted payload and a session object for decrypting the response.
 */
export async function encryptRequest<T>(
  data: T
): Promise<{ payload: EncryptedPayload; session: EncryptionSession }> {
  if (!cachedServerPublicKey) {
    throw new Error(
      'Server public key not set. Call setServerPublicKey() first.'
    )
  }

  // Generate a new AES key for this request
  const aesKey = await generateAESKey()

  const aesKeyRaw = await exportAESKey(aesKey)

  // Encrypt the AES key with server's RSA public key
  const encryptedKey = await encryptAESKeyWithRSA(aesKey)

  // Encrypt the data with AES
  const jsonData = JSON.stringify(data)

  const { iv, ciphertext, tag } = await encryptWithAES(jsonData, aesKey)

  return {
    payload: {
      k: encryptedKey,
      iv,
      data: ciphertext,
      tag
    },
    session: {
      aesKey,
      aesKeyRaw
    }
  }
}

/**
 * Decrypts a response from the server using the session's AES key.
 */
export async function decryptResponse<T>(
  encryptedResponse: EncryptedResponse,
  session: EncryptionSession
): Promise<T> {
  const decryptedJson = await decryptWithAES(
    encryptedResponse.data,
    encryptedResponse.iv,
    encryptedResponse.tag,
    session.aesKey
  )

  return JSON.parse(decryptedJson) as T
}

/**
 * Checks if a response is an encrypted response.
 */
export function isEncryptedResponse(data: unknown): data is EncryptedResponse {
  if (typeof data !== 'object' || data === null) return false

  const d = data as Record<string, unknown>

  return (
    typeof d.iv === 'string' &&
    typeof d.data === 'string' &&
    typeof d.tag === 'string'
  )
}
