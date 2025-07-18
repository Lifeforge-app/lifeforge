import { APIProvider, AdvancedMarker, Map } from '@vis.gl/react-google-maps'
import {
  EmptyStateScreen,
  ModuleHeader,
  ModuleWrapper,
  QueryWrapper
} from 'lifeforge-ui'
import { useMemo } from 'react'
import { useNavigate } from 'react-router'
import colors from 'tailwindcss/colors'

import { useWalletData } from '@apps/Wallet/hooks/useWalletData'
import numberToCurrency from '@apps/Wallet/utils/numberToCurrency'

interface SpendingLocationData {
  lat: number
  lng: number
  amount: number
  transactions: Array<{
    id: string
    particulars: string
    amount: number
    date: string
    location_name: string
  }>
}

function SpendingHeatmap() {
  const { transactionsQuery } = useWalletData()

  const navigate = useNavigate()

  const spendingData = useMemo((): SpendingLocationData[] => {
    if (!transactionsQuery.data) return []

    const expenseTransactions = transactionsQuery.data.filter(
      transaction =>
        transaction.type === 'expenses' &&
        transaction.location_coords?.lat &&
        transaction.location_coords?.lon &&
        transaction.location_name
    )

    const locationGroups: Record<string, SpendingLocationData> = {}

    expenseTransactions.forEach(transaction => {
      const key = `${transaction.location_coords.lat},${transaction.location_coords.lon},${transaction.location_name}`

      if (locationGroups[key]) {
        const existing = locationGroups[key]

        existing.amount += transaction.amount
        existing.transactions.push({
          id: transaction.id,
          particulars: transaction.particulars,
          amount: transaction.amount,
          date: transaction.date,
          location_name: transaction.location_name
        })
      } else {
        locationGroups[key] = {
          lat: transaction.location_coords.lat,
          lng: transaction.location_coords.lon,
          amount: transaction.amount,
          transactions: [
            {
              id: transaction.id,
              particulars: transaction.particulars,
              amount: transaction.amount,
              date: transaction.date,
              location_name: transaction.location_name
            }
          ]
        }
      }
    })

    return Object.values(locationGroups)
  }, [transactionsQuery.data])

  const maxAmountOfTransactions = useMemo(() => {
    return Math.max(
      ...spendingData.map(
        (data: SpendingLocationData) => data.transactions.length
      ),
      0
    )
  }, [spendingData])

  const getMarkerSize = (amountOfTransactions: number) => {
    if (amountOfTransactions === 0) return 30

    const ratio = amountOfTransactions / maxAmountOfTransactions

    return Math.max(30, 30 + ratio * 40)
  }

  const getMarkerColor = (amount: number) => {
    if (amount <= 100) return colors.green[500]
    if (amount <= 500) return colors.yellow[500]
    if (amount <= 1000) return colors.orange[500]

    return colors.red[500]
  }

  const centerPoint = useMemo(() => {
    if (spendingData.length === 0) {
      return { lat: 0, lng: 0 }
    }

    const avgLat =
      spendingData.reduce(
        (sum, data: SpendingLocationData) => sum + data.lat,
        0
      ) / spendingData.length

    const avgLng =
      spendingData.reduce(
        (sum, data: SpendingLocationData) => sum + data.lng,
        0
      ) / spendingData.length

    return { lat: avgLat, lng: avgLng }
  }, [spendingData])

  return (
    <ModuleWrapper>
      <ModuleHeader
        icon="uil:map-marker"
        namespace="apps.wallet"
        title="Spending Heatmap"
        tKey="subsectionsTitleAndDesc"
      />

      <QueryWrapper query={transactionsQuery}>
        {() =>
          spendingData.length > 0 ? (
            <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
              <Map
                className="mb-8 h-full w-full flex-1 overflow-hidden rounded-lg rounded-md"
                defaultCenter={centerPoint}
                defaultZoom={8}
                mapId="SpendingHeatmap"
              >
                {spendingData.map(
                  (locationData: SpendingLocationData, index) => (
                    <AdvancedMarker
                      key={index}
                      position={{
                        lat: locationData.lat,
                        lng: locationData.lng
                      }}
                      onClick={() => {
                        navigate(
                          `/wallet/transactions?query=${encodeURIComponent(
                            locationData.transactions[0].location_name
                          )}`
                        )
                      }}
                    >
                      <div
                        className="relative cursor-pointer rounded-full border-2 border-white shadow-lg transition-transform hover:scale-110"
                        style={{
                          backgroundColor: getMarkerColor(locationData.amount),
                          width: getMarkerSize(
                            locationData.transactions.length
                          ),
                          height: getMarkerSize(
                            locationData.transactions.length
                          )
                        }}
                        title={`${locationData.transactions[0].location_name}: ${numberToCurrency(locationData.amount)}`}
                      >
                        <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                          {locationData.transactions.length}
                        </div>
                      </div>
                    </AdvancedMarker>
                  )
                )}
              </Map>
            </APIProvider>
          ) : (
            <EmptyStateScreen
              icon="tabler:map-pin-off"
              name="location"
              namespace="apps.wallet"
            />
          )
        }
      </QueryWrapper>
    </ModuleWrapper>
  )
}

export default SpendingHeatmap
