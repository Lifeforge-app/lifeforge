import { Icon } from '@iconify/react/dist/iconify.js'
import { APIProvider, AdvancedMarker, Map } from '@vis.gl/react-google-maps'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'

import { Button, ModalHeader, useModalStore } from '@lifeforge/ui'

import { useWalletData } from '@apps/Wallet/hooks/useWalletData'
import { IWalletTransaction } from '@apps/Wallet/interfaces/wallet_interfaces'

import useComponentBg from '@hooks/useComponentBg'

import ViewReceiptModal from '../../views/ListView/components/ViewReceiptModal'

function ViewTransactionModal({
  data: { transaction },
  onClose
}: {
  data: {
    transaction: IWalletTransaction
  }
  onClose: () => void
}) {
  const { t } = useTranslation('apps.wallet')
  const open = useModalStore(state => state.open)
  const { assetsQuery, categoriesQuery, ledgersQuery } = useWalletData()
  const { componentBgLighter } = useComponentBg()
  const asset = assetsQuery.data?.find(asset => asset.id === transaction.asset)
  const category = categoriesQuery.data?.find(
    category => category.id === transaction.category
  )
  const ledger = ledgersQuery.data?.find(
    ledger => ledger.id === transaction.ledger
  )

  return (
    <div className="min-w-[30vw] space-y-4">
      <ModalHeader
        icon="tabler:eye"
        namespace="apps.wallet"
        title="transactions.view"
        onClose={onClose}
      />
      <div className="flex-center flex flex-col">
        {category && (
          <div
            className="shadow-custom mb-6 w-min rounded-lg p-4"
            style={{
              backgroundColor: category.color + (category.color ? '50' : ''),
              color: category.color
            }}
          >
            <Icon className="size-8" icon={category.icon ?? ''} />
          </div>
        )}
        {transaction.type === 'transfer' && (
          <div className="mb-6 w-min rounded-lg bg-blue-500/20 p-4">
            <Icon
              className="size-8 text-blue-500"
              icon="tabler:arrows-exchange"
            />
          </div>
        )}
        <div className="mb-2 text-center text-4xl font-medium">
          <span className="text-bg-500 mr-2">
            {transaction.side === 'debit' ? '+' : '-'}
          </span>
          RM{' '}
          {Intl.NumberFormat('en-MY', {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
          }).format(transaction.amount)}
        </div>
        <p className="text-center text-lg">{transaction.particulars}</p>
        <p className="text-bg-500 mt-2 text-center">
          {dayjs(transaction.date).format('dddd, D MMM YYYY')}
        </p>
      </div>
      <div className="space-y-3">
        <div
          className={clsx(
            'flex-between mt-6 rounded-lg p-4',
            componentBgLighter
          )}
        >
          <div className="text-bg-500 flex items-center gap-3">
            <Icon className="size-6" icon="tabler:exchange" />
            <h3 className="text-lg font-medium">
              {t('inputs.transactionType')}
            </h3>
          </div>
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
            {transaction.type.charAt(0).toUpperCase() +
              transaction.type.slice(1)}
          </p>
        </div>
        <div
          className={clsx('flex-between rounded-lg p-4', componentBgLighter)}
        >
          <div className="text-bg-500 flex items-center gap-3">
            <Icon className="size-6" icon="tabler:calendar" />
            <h3 className="text-lg font-medium">{t('inputs.date')}</h3>
          </div>
          <p className="text-center">
            {dayjs(transaction.date).format('dddd, D MMM YYYY')}
          </p>
        </div>
        <div
          className={clsx(
            'flex-between mt-1 rounded-lg p-4',
            componentBgLighter
          )}
        >
          <div className="text-bg-500 flex items-center gap-3">
            <Icon className="size-6" icon="tabler:category" />
            <h3 className="text-lg font-medium">{t('inputs.category')}</h3>
          </div>
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
        </div>
        <div
          className={clsx(
            'flex-between mt-1 rounded-lg p-4',
            componentBgLighter
          )}
        >
          <div className="text-bg-500 flex items-center gap-3">
            <Icon className="size-6" icon="tabler:wallet" />
            <h3 className="text-lg font-medium">{t('inputs.asset')}</h3>
          </div>
          <p className="flex items-center gap-1">
            <Icon className="size-6" icon={asset!.icon} />
            {asset!.name}
          </p>
        </div>
        <div
          className={clsx(
            'flex-between mt-1 rounded-lg p-4',
            componentBgLighter
          )}
        >
          <div className="text-bg-500 flex items-center gap-3">
            <Icon className="size-6" icon="tabler:book" />
            <h3 className="text-lg font-medium">{t('inputs.ledger')}</h3>
          </div>
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
        </div>
        <div
          className={clsx('mt-1 space-y-4 rounded-lg p-4', componentBgLighter)}
        >
          <div className="text-bg-500 flex items-center gap-3">
            <Icon className="size-6" icon="tabler:receipt" />
            <h3 className="text-lg font-medium">{t('inputs.receipt')}</h3>
          </div>
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
        </div>
        <div
          className={clsx('mt-1 space-y-4 rounded-lg p-4', componentBgLighter)}
        >
          <div className="text-bg-500 flex items-center gap-3">
            <Icon className="size-6" icon="tabler:map-pin" />
            <h3 className="text-lg font-medium">{t('inputs.location')}</h3>
          </div>
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
        </div>
      </div>
    </div>
  )
}

export default ViewTransactionModal
