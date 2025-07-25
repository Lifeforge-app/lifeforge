import { Icon } from '@iconify/react'
import { APIProvider, AdvancedMarker, Map } from '@vis.gl/react-google-maps'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { Button, useModalStore } from 'lifeforge-ui'

import { useWalletData } from '@apps/Wallet/hooks/useWalletData'
import type { IWalletTransaction } from '@apps/Wallet/pages/Transactions'

import ViewReceiptModal from '../../../../views/ListView/components/ViewReceiptModal'
import DetailItem from './components/DetailItem'

function Details({ transaction }: { transaction: IWalletTransaction }) {
  const { assetsQuery, categoriesQuery, ledgersQuery } = useWalletData()

  const open = useModalStore(state => state.open)

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
      {transaction.type !== 'transfer' &&
        (() => {
          const category = categoriesQuery.data?.find(
            category => category.id === transaction.category
          )

          return (
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
          )
        })()}
      {transaction.type === 'transfer'
        ? (() => {
            const fromAsset = assetsQuery.data?.find(
              asset => asset.id === transaction.from
            )

            const toAsset = assetsQuery.data?.find(
              asset => asset.id === transaction.to
            )

            return (
              <DetailItem icon="tabler:exchange" name="asset">
                <div className="flex min-w-0 items-center gap-1">
                  <div className="flex items-center gap-1">
                    <Icon className="size-6 shrink-0" icon={fromAsset!.icon} />
                    <p className="w-full max-w-96 truncate">
                      {fromAsset!.name}
                    </p>
                  </div>
                  <Icon
                    className="text-bg-500 size-6 shrink-0"
                    icon="tabler:arrow-right"
                  />
                  <p className="flex items-center gap-1">
                    <Icon className="size-6 shrink-0" icon={toAsset!.icon} />
                    <p className="w-full max-w-96 truncate">{toAsset!.name}</p>
                  </p>
                </div>
              </DetailItem>
            )
          })()
        : (() => {
            const asset = assetsQuery.data?.find(
              asset => asset.id === transaction.asset
            )

            return (
              <DetailItem icon="tabler:wallet" name="asset">
                <div className="flex items-center gap-1">
                  <Icon className="size-6 shrink-0" icon={asset!.icon} />
                  <p className="w-full max-w-96 truncate">{asset!.name}</p>
                </div>
              </DetailItem>
            )
          })()}
      {transaction.type !== 'transfer' &&
        (() => {
          const ledger = ledgersQuery.data?.filter(ledger =>
            transaction.ledgers.includes(ledger.id)
          )

          if (!ledger || ledger.length === 0) return null

          return (
            <DetailItem icon="tabler:book" name="ledger">
              {ledger ? (
                <ul className="flex flex-col gap-2">
                  {ledger.map(ledgerItem => (
                    <li
                      key={ledgerItem.id}
                      className="flex items-center justify-end gap-2"
                    >
                      <Icon
                        className="size-5"
                        icon={ledgerItem.icon}
                        style={{ color: ledgerItem.color }}
                      />
                      {ledgerItem.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="text-bg-500">No Ledger</span>
              )}
            </DetailItem>
          )
        })()}
      {transaction.receipt && (
        <DetailItem vertical icon="tabler:receipt" name="receipt">
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
        </DetailItem>
      )}
      {transaction.type !== 'transfer' && transaction.location_name && (
        <DetailItem vertical icon="tabler:map-pin" name="location">
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
        </DetailItem>
      )}
    </div>
  )
}

export default Details
