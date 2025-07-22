import {
  forgeController
} from '@functions/forgeController'
import forgeRouter from '@functions/forgeRouter'
import { default as _validateOTP } from '@functions/validateOTP'
import { v4 } from 'uuid'

import * as MasterService from '../services/master.service'

let challenge = v4()
setTimeout(() => {
  challenge = v4()
}, 1000 * 60)

const getChallenge = forgeController
  .route('GET /challenge')
  .description('Get current challenge for master password operations')
  .input({})
  .callback(async () => challenge)

const createMaster = forgeController
  .route('POST /')
  .description('Create a new master password')
  .input({})
  .callback(async ({ pb, body: { password } }) =>
    MasterService.createMaster(pb, password)
  )

const verifyMaster = forgeController
  .route('POST /verify')
  .description('Verify master password')
  .input({})
  .callback(async ({ pb, body: { password } }) =>
    MasterService.verifyMaster(pb, password, challenge)
  )

const validateOTP = forgeController
  .route('POST /otp')
  .description('Validate OTP for master password operations')
  .input({})
  .callback(async ({ pb, body }) => await _validateOTP(pb, body, challenge))

export default forgeRouter({
  getChallenge,
  createMaster,
  verifyMaster,
  validateOTP
})
