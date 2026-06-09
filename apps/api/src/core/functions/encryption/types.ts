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
