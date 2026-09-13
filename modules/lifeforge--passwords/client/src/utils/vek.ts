const PBKDF2_ITERATIONS = 600_000
const PBKDF2_KEY_LENGTH = 256
const SALT_BYTES = 16
const WRAPPED_VEK_DELIMITER = '$'

async function deriveKeyBytes(
  masterPassword: string,
  saltBase64: string
): Promise<ArrayBuffer> {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(masterPassword),
    'PBKDF2',
    false,
    ['deriveBits']
  )

  const salt = Uint8Array.from(atob(saltBase64), c => c.charCodeAt(0))

  return crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256'
    },
    keyMaterial,
    PBKDF2_KEY_LENGTH
  )
}

function generateSalt(): string {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES))

  return btoa(String.fromCharCode(...salt))
}

function unpackWrappedVEK(wrappedVEK: string): {
  saltBase64: string
  encryptedDataBase64: string
} {
  const delimiterIndex = wrappedVEK.indexOf(WRAPPED_VEK_DELIMITER)
  const saltBase64 = wrappedVEK.slice(0, delimiterIndex)
  const encryptedDataBase64 = wrappedVEK.slice(delimiterIndex + 1)

  return { saltBase64, encryptedDataBase64 }
}

export async function unwrapVEK(
  wrappedVEK: string,
  masterPassword: string
): Promise<CryptoKey> {
  const { saltBase64, encryptedDataBase64 } = unpackWrappedVEK(wrappedVEK)

  const keyBytes = await deriveKeyBytes(masterPassword, saltBase64)
  const wrappingKey = await crypto.subtle.importKey(
    'raw',
    keyBytes,
    'AES-GCM',
    false,
    ['decrypt']
  )

  const wrapped = Uint8Array.from(atob(encryptedDataBase64), c =>
    c.charCodeAt(0)
  )

  const iv = wrapped.slice(0, 12)
  const ciphertext = wrapped.slice(12)

  const plaintext = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv, tagLength: 128 },
    wrappingKey,
    ciphertext
  )

  return crypto.subtle.importKey('raw', plaintext, 'AES-GCM', true, [
    'encrypt',
    'decrypt'
  ])
}

export async function wrapVEK(
  vekBytes: ArrayBuffer,
  masterPassword: string
): Promise<string> {
  const saltBase64 = generateSalt()
  const keyBytes = await deriveKeyBytes(masterPassword, saltBase64)
  const wrappingKey = await crypto.subtle.importKey(
    'raw',
    keyBytes,
    'AES-GCM',
    false,
    ['encrypt']
  )

  const iv = crypto.getRandomValues(new Uint8Array(12))
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv, tagLength: 128 },
    wrappingKey,
    vekBytes
  )

  const encryptedData = new Uint8Array(iv.length + ciphertext.byteLength)
  encryptedData.set(iv)
  encryptedData.set(new Uint8Array(ciphertext), iv.length)

  const encryptedDataBase64 = btoa(String.fromCharCode(...encryptedData))

  return saltBase64 + WRAPPED_VEK_DELIMITER + encryptedDataBase64
}
