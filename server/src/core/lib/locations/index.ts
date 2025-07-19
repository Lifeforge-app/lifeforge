import ClientError from '@functions/ClientError'
import {
  bulkRegisterControllers,
  forgeController
} from '@functions/forgeController'
import { getAPIKey } from '@functions/getAPIKey'
import express from 'express'

import { LocationsControllersSchemas } from 'shared/types/controllers'

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

    const response = await fetch(
      `https://places.googleapis.com/v1/places:searchText`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-FieldMask':
            'places.displayName,places.location,places.formattedAddress',
          'X-Goog-Api-Key': key
        },
        body: JSON.stringify({
          textQuery: q
        })
      }
    ).then(res => res.json())

    const places: {
      displayName: {
        languageCode: string
        text: string
      }
      formattedAddress: string
      location: {
        latitude: number
        longitude: number
      }
    }[] = response.places

    return places.map(place => ({
      name: place.displayName.text,
      formattedAddress: place.formattedAddress,
      location: {
        latitude: place.location.latitude,
        longitude: place.location.longitude
      }
    }))
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
