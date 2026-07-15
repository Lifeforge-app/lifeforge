import { default as _validateOTP } from '@functions/auth/validateOTP'
import {
  connectToPocketBase,
  validateEnvironmentVariables
} from '@functions/database/dbUtils'
import z from 'zod'

import forge from '../forge'

export const validateOTP = forge
  .mutation({
    description: 'Verify one-time password',
    encrypted: false,
    input: {
      body: z.object({
        otp: z.string(),
        otpId: z.string()
      })
    },
    output: {
      OK: z.boolean()
    }
  })
  .callback(async ({ pb, body, response }) =>
    response.ok(await _validateOTP(pb, body))
  )

export const generateOTP = forge
  .query({
    description: 'Generate one-time password',
    encrypted: false,
    input: {},
    output: {
      OK: z.string()
    }
  })
  .callback(async ({ pb, response }) =>
    response.ok(
      (
        await pb.instance
          .collection('users')
          .requestOTP(pb.instance.authStore.record?.email)
      ).otpId
    )
  )

export const createFirstUser = forge
  .mutation({
    description: 'Create the first user (only works when no users exist)',
    noAuth: true,
    input: {
      body: z.object({
        email: z.string().email(),
        username: z.string().min(3),
        name: z.string().min(1),
        password: z.string().min(8)
      })
    },
    output: {
      CREATED: z.object({
        state: z.literal('success')
      }),
      BAD_REQUEST: z.string()
    }
  })
  .callback(async ({ body: { email, username, name, password }, response }) => {
    const config = validateEnvironmentVariables()

    const superPBInstance = await connectToPocketBase(config)

    const users = await superPBInstance.collection('users').getFullList()

    if (users.length > 0) {
      return response.badRequest('Users already exist')
    }

    await superPBInstance.collection('users').create({
      email,
      username,
      name,
      verified: true,
      password,
      passwordConfirm: password,
      theme: 'system',
      language: 'en',
      fontScale: 1.0,
      borderRadiusMultiplier: 1.0
    })

    return response.created({
      state: 'success' as const
    })
  })
