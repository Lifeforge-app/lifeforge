import {
  forgeController
} from '@functions/forgeController'
import forgeRouter from '@functions/forgeRouter'

import { UserControllersSchemas } from 'shared/types/controllers'

import * as OAuthService from '../services/oauth.service'

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

export default forgeRouter({
  listOAuthProviders,
  getOAuthEndpoint,
  oauthVerify
})
