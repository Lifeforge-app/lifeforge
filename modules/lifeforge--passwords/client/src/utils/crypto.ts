export async function encrypt(
  plaintext: string,
  vek: CryptoKey
): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const data = new TextEncoder().encode(plaintext)

  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv, tagLength: 128 },
    vek,
    data
  )

  const result = new Uint8Array(iv.length + ciphertext.byteLength)
  result.set(iv)
  result.set(new Uint8Array(ciphertext), iv.length)

  return btoa(String.fromCharCode(...result))
}

export async function decrypt(
  encryptedBase64: string,
  vek: CryptoKey
): Promise<string> {
  const encrypted = Uint8Array.from(atob(encryptedBase64), c => c.charCodeAt(0))

  const iv = encrypted.slice(0, 12)
  const ciphertext = encrypted.slice(12)

  const plaintext = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv, tagLength: 128 },
    vek,
    ciphertext
  )

  return new TextDecoder().decode(plaintext)
}
