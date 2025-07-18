import {
  bulkRegisterControllers,
  forgeController
} from '@functions/forgeController'
import { singleUploadMiddleware } from '@middlewares/uploadMiddleware'
import express from 'express'

import { UserControllersSchemas } from 'shared/types/controllers'

import * as SettingsService from '../services/settings.service'

const userSettingsRouter = express.Router()

const updateAvatar = forgeController
  .route('PUT /avatar')
  .description('Update user avatar')
  .middlewares(singleUploadMiddleware)
  .schema(UserControllersSchemas.Settings.updateAvatar)
  .callback(async ({ req: { file }, pb }) =>
    SettingsService.updateAvatar(pb, file)
  )

const deleteAvatar = forgeController
  .route('DELETE /avatar')
  .description('Delete user avatar')
  .schema(UserControllersSchemas.Settings.deleteAvatar)
  .statusCode(204)
  .callback(async ({ pb }) => SettingsService.deleteAvatar(pb))

const updateProfile = forgeController
  .route('PATCH /')
  .description('Update user profile')
  .schema(UserControllersSchemas.Settings.updateProfile)
  .statusCode(200)
  .callback(async ({ body: { data }, pb }) =>
    SettingsService.updateProfile(pb, data)
  )

const requestPasswordReset = forgeController
  .route('POST /request-password-reset')
  .description('Request password reset')
  .schema(UserControllersSchemas.Settings.requestPasswordReset)
  .callback(async ({ pb }) => SettingsService.requestPasswordReset(pb))

bulkRegisterControllers(userSettingsRouter, [
  updateAvatar,
  deleteAvatar,
  updateProfile,
  requestPasswordReset
])

export default userSettingsRouter
