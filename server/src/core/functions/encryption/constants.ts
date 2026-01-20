import { ROOT_DIR } from '@constants'
import path from 'path'

import { createServiceLogger } from '@functions/logging'

// Key storage paths
export const KEYS_DIR = path.join(ROOT_DIR, 'keys')

export const PRIVATE_KEY_PATH = path.join(KEYS_DIR, 'server_private.pem')

export const PUBLIC_KEY_PATH = path.join(KEYS_DIR, 'server_public.pem')

// Encryption settings
export const RSA_KEY_SIZE = 2048

export const AES_ALGORITHM = 'aes-256-gcm'

export const AES_KEY_LENGTH = 32 // 256 bits

export const IV_LENGTH = 12 // 96 bits for GCM

export const AUTH_TAG_LENGTH = 16 // 128 bits

export const logger = createServiceLogger('Encryption')
