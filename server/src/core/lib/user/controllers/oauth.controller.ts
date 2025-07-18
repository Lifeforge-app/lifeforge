import {
  bulkRegisterControllers,
  forgeController
} from '@functions/forgeController'
import express from 'express'

import { UserControllersSchemas } from 'shared/types/controllers'

import * as OAuthService from '../services/oauth.service'

const userOAuthRouter = express.Router()

const listOAuthProviders = forgeController
  .route('GET /providers')
  .description('List available OAuth providers')
  .schema(UserControllersSchemas.Oauth.listOAuthProviders)
  .callback(async () => await OAuthService.listOAuthProviders())

const getOAuthEndpoint = forgeController
  .route('GET /endpoint')
  .description('Get OAuth endpoint for a provider')
  .schema(UserControllersSchemas.Oauth.getOAuthEndpoint)
  .callback(
    async ({ pb, query: { provider } }) =>
      await OAuthService.getOAuthEndpoint(pb, provider)
  )

const oauthVerify = forgeController
  .route('POST /verify')
  .description('Verify OAuth callback')
  .schema(UserControllersSchemas.Oauth.oauthVerify)
  .callback(
    async ({ pb, body, req }) =>
      await OAuthService.oauthVerify(pb, {
        ...body,
        origin: req.headers.origin || ''
      })
  )

bulkRegisterControllers(userOAuthRouter, [
  listOAuthProviders,
  getOAuthEndpoint,
  oauthVerify
])

export default userOAuthRouter
