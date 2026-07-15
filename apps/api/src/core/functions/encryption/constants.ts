import { createServiceLogger } from '@functions/logging'

export const RSA_KEY_SIZE = 4096

export const AES_ALGORITHM = 'aes-256-gcm'

export const AES_KEY_LENGTH = 32 // 256 bits

export const IV_LENGTH = 12 // 96 bits for GCM

export const AUTH_TAG_LENGTH = 16 // 128 bits

export const logger = createServiceLogger('Encryption')
