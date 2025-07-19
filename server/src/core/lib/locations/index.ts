import ClientError from '@functions/ClientError'
import {
  bulkRegisterControllers,
  forgeController
} from '@functions/forgeController'
import { getAPIKey } from '@functions/getAPIKey'
import express from 'express'

import { LocationsControllersSchemas } from 'shared/types/controllers'

import * as LocationsService from './services/locations.service'

const router = express.Router()

const getLocation = forgeController
  .route('GET /')
  .description('Search for locations')
  .schema(LocationsControllersSchemas.Locations.getLocations)
  .callback(async ({ query: { q }, pb }) => {
    const key = await getAPIKey('gcloud', pb)

    if (!key) {
      throw new ClientError('API key not found')
    }

    return LocationsService.searchLocations(q, key)
  })

const checkIsEnabled = forgeController
  .route('GET /enabled')
  .description('Check if Google Cloud API key exists')
  .schema(LocationsControllersSchemas.Locations.checkIsEnabled)
  .callback(async ({ pb }) => {
    const key = await getAPIKey('gcloud', pb)

    return !!key
  })

bulkRegisterControllers(router, [getLocation, checkIsEnabled])

export default router
