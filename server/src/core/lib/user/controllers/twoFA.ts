import ClientError from '@functions/ClientError'
import {
  forgeController
} from '@functions/forgeController'
import forgeRouter from '@functions/forgeRouter'
import { default as _validateOTP } from '@functions/validateOTP'

import { UserControllersSchemas } from 'shared/types/controllers'

import * as twoFAService from '../services/twoFA.service'

export let canDisable2FA = false

const getChallenge = forgeController
  .route('GET /challenge')
  .description('Get 2FA challenge')
  .schema(UserControllersSchemas.TwoFa.getChallenge)
  .callback(async () => twoFAService.getChallenge())

const requestOTP = forgeController
  .route('GET /otp')
  .description('Request OTP for 2FA')
  .schema(UserControllersSchemas.TwoFa.requestOtp)
  .callback(
    async ({ pb, query: { email } }) => await twoFAService.requestOTP(pb, email)
  )

const validateOTP = forgeController
  .route('POST /otp')
  .description('Validate OTP for 2FA')
  .schema(UserControllersSchemas.TwoFa.validateOtp)
  .callback(async ({ pb, body }) => {
    if (await _validateOTP(pb, body, twoFAService.challenge)) {
      canDisable2FA = true
      setTimeout(
        () => {
          canDisable2FA = false
        },
        1000 * 60 * 5
      )

      return true
    }

    return false
  })

const generateAuthtenticatorLink = forgeController
  .route('GET /link')
  .description('Generate authenticator link for 2FA')
  .schema(UserControllersSchemas.TwoFa.generateAuthtenticatorLink)
  .callback(
    async ({
      pb,
      req: {
        headers: { authorization }
      }
    }) =>
      await twoFAService.generateAuthenticatorLink(
        pb,
        authorization!.replace('Bearer ', '')
      )
  )

const verifyAndEnable2FA = forgeController
  .route('POST /verify-and-enable')
  .description('Verify and enable 2FA')
  .schema(UserControllersSchemas.TwoFa.verifyAndEnable2Fa)
  .callback(
    async ({
      pb,
      body: { otp },
      req: {
        headers: { authorization }
      }
    }) =>
      await twoFAService.verifyAndEnable2FA(
        pb,
        authorization!.replace('Bearer ', ''),
        otp
      )
  )

const disable2FA = forgeController
  .route('POST /disable')
  .description('Disable 2FA')
  .schema(UserControllersSchemas.TwoFa.disable2Fa)
  .callback(async ({ pb }) => {
    if (!canDisable2FA) {
      throw new ClientError(
        'You cannot disable 2FA right now. Please try again later.',
        403
      )
    }
    await twoFAService.disable2FA(pb)
    canDisable2FA = false
  })

const verify2FA = forgeController
  .route('POST /verify')
  .description('Verify 2FA code')
  .schema(UserControllersSchemas.TwoFa.verify2Fa)
  .callback(async ({ body: { otp, tid, type } }) =>
    twoFAService.verify2FA(otp, tid, type)
  )

export default forgeRouter({
  getChallenge,
  requestOTP,
  validateOTP,
  generateAuthtenticatorLink,
  verifyAndEnable2FA,
  disable2FA,
  verify2FA
})
