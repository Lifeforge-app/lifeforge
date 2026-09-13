import crypto from 'node:crypto'
import z from 'zod'

import type { IPBService } from '@lifeforge/pocketbase'

import forge from '../forge'
import schema from '../schema'
import { challenge } from '../utils/challenge'
import { hash, verify as verifyPasswordHash } from '../utils/passwordHash'
import { generateAndWrapRecoveryVEK } from '../utils/recoveryHelper'
import {
  decryptVEKWithKey,
  deriveWrappingKey,
  encryptVEKWithKey,
  generateVEKSalt,
  packWrappedVEK,
  unpackWrappedVEK
} from '../utils/vekDerivation'

async function getConfigRecord(pb: IPBService<typeof schema>) {
  const records = await pb.getFullList.collection('config').execute()

  return records[0] || null
}

export const hasMasterPassword = forge
  .query({
    description: 'Check if a master password has been configured',
    output: {
      OK: z.boolean()
    }
  })
  .callback(async ({ pb, response }) => {
    const config = await getConfigRecord(pb)

    return response.ok(!!config?.master_hash)
  })

export const getChallenge = forge
  .query({
    description: 'Retrieve challenge token for master password authentication',
    output: {
      OK: z.string()
    }
  })
  .callback(async ({ response }) => response.ok(challenge))

export const create = forge
  .mutation({
    description: 'Create a new master password',
    input: {
      body: z.object({
        password: z.string()
      })
    },
    output: {
      CREATED: z.object({
        recovery_key: z.string()
      })
    }
  })
  .callback(
    async ({
      pb,
      body: { password },
      core: {
        crypto: { decrypt2 }
      },
      response
    }) => {
      const decryptedMaster = decrypt2(password, challenge)

      const master_hash = await hash(decryptedMaster)

      const saltBase64 = generateVEKSalt()
      const derivedKey = await deriveWrappingKey(decryptedMaster, saltBase64)

      const vek = crypto.randomBytes(32)
      const encryptedData = encryptVEKWithKey(vek, derivedKey)
      const wrapped_vek = packWrappedVEK(saltBase64, encryptedData)

      const { recovery_key, recovery_wrapped_vek } =
        generateAndWrapRecoveryVEK(vek)

      const existing = await getConfigRecord(pb)

      const data = {
        master_hash,
        wrapped_vek,
        recovery_wrapped_vek
      }

      if (existing) {
        await pb.update
          .collection('config')
          .id(existing.id)
          .data(data)
          .execute()
      } else {
        await pb.create.collection('config').data(data).execute()
      }

      return response.created({ recovery_key })
    }
  )

export const verify = forge
  .mutation({
    description: 'Verify master password against stored hash',
    input: {
      body: z.object({
        password: z.string()
      })
    },
    output: {
      OK: z.boolean()
    }
  })
  .callback(
    async ({
      pb,
      body: { password },
      core: {
        crypto: { decrypt2 }
      },
      response
    }) => {
      const decryptedMaster = decrypt2(password, challenge)

      const config = await getConfigRecord(pb)

      if (!config) {
        return response.ok(false)
      }

      const isMatch = await verifyPasswordHash(
        decryptedMaster,
        config.master_hash
      )

      return response.ok(isMatch)
    }
  )

export const getWrappedVEK = forge
  .query({
    description: 'Get the wrapped VEK for the authenticated user',
    output: {
      OK: z.object({
        wrapped_vek: z.string()
      })
    }
  })
  .callback(async ({ pb, response }) => {
    const config = await getConfigRecord(pb)

    return response.ok({
      wrapped_vek: config?.wrapped_vek || ''
    })
  })

export const updateWrappedVEK = forge
  .mutation({
    description:
      'Update the wrapped VEK (used during master password rotation)',
    input: {
      body: z.object({
        password: z.string(),
        new_password: z.string(),
        new_wrapped_vek: z.string()
      })
    },
    output: {
      OK: z.object({
        recovery_key: z.string()
      }),
      UNAUTHORIZED: true
    }
  })
  .callback(
    async ({
      pb,
      body: { password, new_password, new_wrapped_vek },
      core: {
        crypto: { decrypt2 }
      },
      response
    }) => {
      const decryptedMaster = decrypt2(password, challenge)
      const decryptedNewMaster = decrypt2(new_password, challenge)

      const config = await getConfigRecord(pb)

      if (!config) {
        return response.unauthorized()
      }

      const isMatch = await verifyPasswordHash(
        decryptedMaster,
        config.master_hash
      )

      if (!isMatch) {
        return response.unauthorized()
      }

      const new_master_hash = await hash(decryptedNewMaster)

      const { saltBase64: oldSalt, encryptedDataBase64: oldEncryptedData } =
        unpackWrappedVEK(config.wrapped_vek)

      const oldDerivedKey = await deriveWrappingKey(decryptedMaster, oldSalt)

      const vek = decryptVEKWithKey(oldEncryptedData, oldDerivedKey)

      const { recovery_key, recovery_wrapped_vek } =
        generateAndWrapRecoveryVEK(vek)

      await pb.update
        .collection('config')
        .id(config.id)
        .data({
          master_hash: new_master_hash,
          wrapped_vek: new_wrapped_vek,
          recovery_wrapped_vek
        })
        .execute()

      return response.ok({ recovery_key })
    }
  )
