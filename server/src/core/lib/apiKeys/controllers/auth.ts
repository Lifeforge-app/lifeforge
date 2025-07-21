import {
  forgeController
} from '@functions/forgeController'
import forgeRouter from '@functions/forgeRouter'
import { default as _validateOTP } from '@functions/validateOTP'

import { ApiKeysControllersSchemas } from 'shared/types/controllers'

import * as authService from '../services/auth.service'

const getChallenge = forgeController
  .route('GET /challenge')
  .description('Get authentication challenge')
  .schema(ApiKeysControllersSchemas.Auth.getChallenge)
  .callback(async () => authService.challenge)

const createOrUpdateMasterPassword = forgeController
  .route('POST /')
  .description('Create or update master password')
  .schema(ApiKeysControllersSchemas.Auth.createOrUpdateMasterPassword)
  .callback(async ({ pb, body: { password } }) =>
    authService.createOrUpdateMasterPassword(pb, password)
  )

const verifyMasterPassword = forgeController
  .route('POST /verify')
  .description('Verify master password')
  .schema(ApiKeysControllersSchemas.Auth.verifyMasterPassword)
  .callback(async ({ pb, body: { password } }) =>
    authService.verifyMasterPassword(pb, password, authService.challenge)
  )

const verifyOTP = forgeController
  .route('POST /otp')
  .description('Verify OTP')
  .schema(ApiKeysControllersSchemas.Auth.verifyOtp)
  .callback(
    async ({ pb, body }) => await _validateOTP(pb, body, authService.challenge)
  )

export default forgeRouter({
  getChallenge,
  createOrUpdateMasterPassword,
  verifyMasterPassword,
  verifyOTP
})
