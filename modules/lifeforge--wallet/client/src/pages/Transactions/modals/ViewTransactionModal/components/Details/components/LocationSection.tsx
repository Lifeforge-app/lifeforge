import { useQuery } from '@tanstack/react-query'
import { APIProvider, AdvancedMarker, Map } from '@vis.gl/react-google-maps'

import { EmptyStateScreen, WithQuery } from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import { useTransactionDetails } from '../TransactionDetailsContext'
import DetailItem from './DetailItem'

function LocationSection() {
  const transaction = useTransactionDetails()

  const googleMapAPIKey = useQuery(
    forgeAPI.getAPIKeys({ keyId: 'gcloud' }).queryOptions({ retry: false })
  )

  if (transaction.type === 'transfer' || !transaction.location_name) return null

  return (
    <DetailItem vertical icon="tabler:map-pin" label="location">
      <WithQuery query={googleMapAPIKey} showRetryButton={false}>
        {key =>
          key ? (
            <APIProvider apiKey={key}>
              <Map
                defaultCenter={{
                  lat: transaction.location_coords?.lat || 0,
                  lng: transaction.location_coords?.lon || 0
                }}
                defaultZoom={15}
                mapId="LocationMap"
                style={{
                  height: '24rem',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden'
                }}
              >
                <AdvancedMarker
                  position={{
                    lat: transaction.location_coords?.lat || 0,
                    lng: transaction.location_coords?.lon || 0
                  }}
                />
              </Map>
            </APIProvider>
          ) : (
            <EmptyStateScreen
              smaller
              icon="tabler:key-off"
              message={{ id: 'mapKey' }}
            />
          )
        }
      </WithQuery>
    </DetailItem>
  )
}

export default LocationSection
