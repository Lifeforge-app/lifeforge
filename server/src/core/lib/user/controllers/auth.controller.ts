import {
  bulkRegisterControllers,
  forgeController
} from '@functions/forgeController'
import { default as _validateOTP } from '@functions/validateOTP'
import express from 'express'

import { UserControllersSchemas } from 'shared/types/controllers'

import * as AuthService from '../services/auth.service'

const userAuthRouter = express.Router()

const validateOTP = forgeController
  .route('POST /validate-otp')
  .description('Validate OTP')
  .schema(UserControllersSchemas.Auth.validateOtp)
  .callback(async ({ pb, body }) => await _validateOTP(pb, body))

const generateOTP = forgeController
  .route('GET /otp')
  .description('Generate OTP')
  .schema(UserControllersSchemas.Auth.generateOtp)
  .callback(async ({ pb }) => await AuthService.generateOTP(pb))

const login = forgeController
  .route('POST /login')
  .description('User login')
  .schema(UserControllersSchemas.Auth.login)
  .callback(
    async ({ body: { email, password } }) =>
      await AuthService.login(email, password)
  )

const verifySessionToken = forgeController
  .route('POST /verify')
  .description('Verify session token')
  .schema(UserControllersSchemas.Auth.verifySessionToken)
  .callback(async ({ req }) =>
    AuthService.verifySessionToken(
      req.headers.authorization?.split(' ')[1].trim()
    )
  )

bulkRegisterControllers(userAuthRouter, [
  validateOTP,
  generateOTP,
  login,
  verifySessionToken
])

export default userAuthRouter
