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
export { default as decryptAESKey } from './functions/decryptAESKey'

export { default as getPublicKey } from './functions/getPublicKey'

export { default as decryptPayload } from './functions/decryptPayload'

export { default as encryptResponse } from './functions/encryptResponse'

export { default as ensureKeysExist } from './functions/ensureKeyExists'
