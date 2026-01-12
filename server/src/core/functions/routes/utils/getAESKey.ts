import { Request, Response } from 'express'

import { decryptAESKey } from '@functions/encryption'

import { clientError } from './response'

export default function getAESKey(
  req: Request,
  res: Response,
  isEncrypted: boolean,
  callerModuleId?: string
): Buffer | null | void {
  // Store the decrypted AES key for response encryption
  let aesKey: Buffer | null = null

  // For GET requests with encryption, client sends AES key via header
  if (isEncrypted && req.method === 'GET') {
    const encryptedKeyHeader = req.headers['x-lifeforge-key'] as
      | string
      | undefined

    if (encryptedKeyHeader) {
      try {
        aesKey = decryptAESKey(encryptedKeyHeader)
      } catch {
        return clientError({
          res,
          message: 'Failed to decrypt encryption key',
          moduleName: callerModuleId
        })
      }
    }
  }

  return aesKey
}
