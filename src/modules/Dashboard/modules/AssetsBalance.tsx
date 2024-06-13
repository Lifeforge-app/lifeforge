import { Icon } from '@iconify/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import useFetch from '@hooks/useFetch'
import { type IWalletAssetEntry } from '@interfaces/wallet_interfaces'
import { numberToMoney } from '@utils/strings'

export default function AssetsBalance(): React.ReactElement {
  const { t } = useTranslation()
  const [assets] = useFetch<IWalletAssetEntry[]>('wallet/assets/list')

  return (
    <div className="flex size-full flex-col gap-4 rounded-lg bg-bg-50 p-8 shadow-custom dark:bg-bg-900">
      <h1 className="mb-2 flex items-center gap-2 text-xl font-semibold">
        <Icon icon="tabler:wallet" className="text-2xl" />
        <span className="ml-2">
          {t('dashboard.modules.walletBalance.title')}
        </span>
      </h1>
      <APIComponentWithFallback data={assets}>
        <ul className="grid h-full grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4 overflow-y-auto">
          {typeof assets !== 'string' &&
            assets.map(asset => (
              <Link
                to={'/wallet/assets'}
                key={asset.id}
                className="flex h-full items-center justify-between gap-4 rounded-lg bg-bg-100 p-4 pl-6 shadow-[4px_4px_10px_rgba(0,0,0,0.1)] transition-all hover:bg-bg-200 dark:bg-bg-800 dark:hover:bg-bg-700/50"
              >
                <div className="flex items-center gap-4">
                  <div className="rounded-md bg-bg-700 p-2">
                    <Icon icon="tabler:cash" className="size-6" />
                  </div>
                  <div className="flex flex-col">
                    <div className="font-semibold ">{asset.name}</div>
                    <div className="text-sm text-bg-500">
                      RM {numberToMoney(asset.balance)}
                    </div>
                  </div>
                </div>
                <button className="rounded-lg p-4 text-bg-500 transition-all">
                  <Icon icon="tabler:chevron-right" className="text-2xl" />
                </button>
              </Link>
            ))}
        </ul>
      </APIComponentWithFallback>
    </div>
  )
}
