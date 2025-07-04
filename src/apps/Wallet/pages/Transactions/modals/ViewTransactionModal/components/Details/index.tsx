import { Icon } from '@iconify/react/dist/iconify.js'
import { APIProvider, AdvancedMarker, Map } from '@vis.gl/react-google-maps'
import clsx from 'clsx'
import dayjs from 'dayjs'

import { Button, useModalStore } from '@lifeforge/ui'

import { useWalletData } from '@apps/Wallet/hooks/useWalletData'
import { IWalletTransaction } from '@apps/Wallet/interfaces/wallet_interfaces'

import ViewReceiptModal from '../../../../views/ListView/components/ViewReceiptModal'
import DetailItem from './components/DetailItem'

function Details({ transaction }: { transaction: IWalletTransaction }) {
  const { assetsQuery, categoriesQuery, ledgersQuery } = useWalletData()
  const open = useModalStore(state => state.open)
  const asset = assetsQuery.data?.find(asset => asset.id === transaction.asset)
  const category = categoriesQuery.data?.find(
    category => category.id === transaction.category
  )
  const ledger = ledgersQuery.data?.find(
    ledger => ledger.id === transaction.ledger
  )

  return (
    <div className="mt-6 space-y-3">
      <DetailItem icon="tabler:exchange" name="transactionType">
        <p className="flex items-center gap-1">
          <Icon
            className={clsx('size-5', {
              'text-green-500': transaction.type === 'income',
              'text-red-500': transaction.type === 'expenses',
              'text-blue-500': transaction.type === 'transfer'
            })}
            icon={
              {
                income: 'tabler:login-2',
                expenses: 'tabler:logout',
                transfer: 'tabler:arrows-exchange'
              }[transaction.type]
            }
          />
          {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
        </p>
      </DetailItem>
      <DetailItem icon="tabler:calendar" name="date">
        <p className="text-center">
          {dayjs(transaction.date).format('dddd, D MMM YYYY')}
        </p>
      </DetailItem>
      {transaction.type !== 'transfer' && (
        <DetailItem icon="tabler:category" name="category">
          <p className="flex items-center gap-1">
            <Icon
              className="size-6"
              icon={category!.icon}
              style={{
                color: category!.color
              }}
            />
            {category!.name}
          </p>
        </DetailItem>
      )}
      <DetailItem icon="tabler:wallet" name="asset">
        <p className="flex items-center gap-1">
          <Icon className="size-6" icon={asset!.icon} />
          {asset!.name}
        </p>
      </DetailItem>
      <DetailItem icon="tabler:book" name="ledger">
        {ledger ? (
          <p className="flex items-center gap-1">
            <Icon
              className="size-6"
              icon={ledger.icon}
              style={{
                color: ledger.color
              }}
            />
            {ledger.name}
          </p>
        ) : (
          <span className="text-bg-500">No Ledger</span>
        )}
      </DetailItem>
      <DetailItem vertical icon="tabler:receipt" name="receipt">
        {transaction.receipt ? (
          <Button
            className="w-full"
            icon="tabler:eye"
            namespace="apps.wallet"
            variant="secondary"
            onClick={() => {
              open(ViewReceiptModal, {
                src: `${import.meta.env.VITE_API_HOST}/media/${transaction.collectionId}/${transaction.id}/${transaction.receipt}`
              })
            }}
          >
            View Receipt
          </Button>
        ) : (
          <p className="text-bg-500 mb-2 text-center">No Receipt</p>
        )}
      </DetailItem>
      <DetailItem vertical icon="tabler:map-pin" name="location">
        {transaction.location_name ? (
          <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
            <Map
              className="h-96 overflow-hidden rounded-md"
              defaultCenter={{
                lat: transaction.location_coords?.lat || 0,
                lng: transaction.location_coords?.lon || 0
              }}
              defaultZoom={15}
              mapId="LocationMap"
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
          <p className="text-bg-500 mb-2 text-center">No Location</p>
        )}
      </DetailItem>
    </div>
  )
}

export default Details
