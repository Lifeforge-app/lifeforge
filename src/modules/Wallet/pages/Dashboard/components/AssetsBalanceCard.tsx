import { Icon } from '@iconify/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/Screens/EmptyStateScreen'
import Scrollbar from '@components/Scrollbar'
import { useWalletContext } from '@providers/WalletProvider'

function AssetsBalanceCard(): React.ReactElement {
  const navigate = useNavigate()
  const { assets } = useWalletContext()
  const { t } = useTranslation()

  return (
    <div className="col-span-1 row-span-2 flex h-full min-h-96 flex-col rounded-lg bg-bg-50 p-6 shadow-custom dark:bg-bg-900">
      <div className="flex-between flex">
        <h1 className="flex items-center gap-2 text-xl font-semibold">
          <Icon icon="tabler:wallet" className="text-2xl" />
          <span className="ml-2">{t('dashboard.widgets.balances')}</span>
        </h1>
        <Link
          to="./assets"
          className="flex items-center gap-2 rounded-lg p-2 text-bg-500 transition-all hover:bg-bg-100 hover:text-bg-800 dark:hover:bg-bg-700/30 dark:hover:text-bg-50"
        >
          <Icon icon="tabler:chevron-right" className="text-xl" />
        </Link>
      </div>
      <APIComponentWithFallback data={assets}>
        {assets =>
          assets.length > 0 ? (
            <Scrollbar className="mt-6">
              <ul className="flex h-full flex-col gap-4">
                {assets.map(asset => (
                  <Link
                    key={asset.id}
                    to={`/wallet/transactions?asset=${asset.id}`}
                    className="flex-between flex w-full min-w-0 flex-1 flex-col gap-4 rounded-lg bg-bg-100 p-6 shadow-[4px_4px_10px_rgba(0,0,0,0.1)] transition-all hover:bg-bg-200 dark:bg-bg-800 dark:hover:bg-bg-700/50 [@media(min-width:400px)]:flex-row"
                  >
                    <div className="flex w-full min-w-0 items-center gap-4">
                      <Icon icon={asset.icon} className="size-6 shrink-0" />
                      <div className="w-full min-w-0 truncate font-semibold">
                        {asset.name}
                      </div>
                    </div>
                    <div className="whitespace-nowrap text-right text-3xl font-medium">
                      <span className="text-xl text-bg-500">RM</span>{' '}
                      {(+asset.balance).toFixed(2)}
                    </div>
                  </Link>
                ))}
              </ul>
            </Scrollbar>
          ) : (
            <EmptyStateScreen
              title={t('emptyState.wallet.assets.title')}
              description={t('emptyState.wallet.assets.description')}
              ctaContent="Add Asset"
              onCTAClick={() => {
                navigate('/wallet/assets')
              }}
            />
          )
        }
      </APIComponentWithFallback>
    </div>
  )
}

export default AssetsBalanceCard
