import { getAPIKey } from '@functions/database'
import { forgeController, forgeRouter } from '@functions/routes'
import { ClientError } from '@functions/routes/utils/response'
import { z } from 'zod/v4'

const getLocation = forgeController
  .route('GET /')
  .description('Search for locations')
  .input({
    query: z.object({
      q: z.string()
    })
  })
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
    }[] = response.places ?? []

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
  .input({})
  .callback(async ({ pb }) => {
    const key = await getAPIKey('gcloud', pb)

    return !!key
  })

export default forgeRouter({ getLocation, checkIsEnabled })
