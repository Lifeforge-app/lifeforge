import { decrypt2 } from '@functions/auth/encryption'
import { default as _validateOTP } from '@functions/auth/validateOTP'
import { forgeController, forgeRouter } from '@functions/routes'
import bcrypt from 'bcrypt'
import { z } from 'zod/v4'

import { challenge } from '..'

const getChallenge = forgeController.query
  .description('Get authentication challenge')
  .input({})
  .callback(async () => challenge)

const createOrUpdate = forgeController.mutation
  .description('Create or update master password')
  .input({
    body: z.object({
      password: z.string()
    })
  })
  .callback(async ({ pb, body: { password } }) => {
    const salt = await bcrypt.genSalt(10)

    const APIKeysMasterPasswordHash = await bcrypt.hash(password, salt)

    const id = pb.instance.authStore.record?.id

    if (!id) {
      throw new Error('No user found')
    }

    await pb.update
      .collection('users__users')
      .id(id)
      .data({
        APIKeysMasterPasswordHash
      })
      .execute()
  })

const verify = forgeController.mutation
  .description('Verify master password')
  .input({
    body: z.object({
      password: z.string()
    })
  })
  .callback(async ({ pb, body: { password } }) => {
    const id = pb.instance.authStore.record?.id

    if (!id) {
      return false
    }

    const decryptedMaster = decrypt2(password, challenge)

    const user = await pb.getOne.collection('users__users').id(id).execute()

    const { APIKeysMasterPasswordHash } = user

    return await bcrypt.compare(decryptedMaster, APIKeysMasterPasswordHash)
  })

const verifyOTP = forgeController.mutation
  .description('Verify OTP')
  .input({
    body: z.object({
      otp: z.string(),
      otpId: z.string()
    })
  })
  .callback(async ({ pb, body }) => await _validateOTP(pb, body, challenge))

export default forgeRouter({
  getChallenge,
  createOrUpdate,
  verify,
  verifyOTP
})
