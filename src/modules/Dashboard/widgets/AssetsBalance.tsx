import { Icon } from '@iconify/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import useFetch from '@hooks/useFetch'
import useThemeColors from '@hooks/useThemeColor'
import { type IWalletAsset } from '@interfaces/wallet_interfaces'
import { numberToMoney } from '@utils/strings'

export default function AssetsBalance(): React.ReactElement {
  const { t } = useTranslation()
  const { componentBg } = useThemeColors()
  const [assets] = useFetch<IWalletAsset[]>('wallet/assets')

  return (
    <div
      className={`flex size-full flex-col gap-4 rounded-lg p-4 shadow-custom ${componentBg}`}
    >
      <h1 className="mb-2 flex items-center gap-2 text-xl font-semibold">
        <Icon icon="tabler:wallet" className="text-2xl" />
        <span className="ml-2">
          {t('dashboard.widgets.assetsBalance.title')}
        </span>
      </h1>
      <APIComponentWithFallback data={assets}>
        {assets => (
          <ul className="grid h-full grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4 overflow-y-auto">
            {assets.map(asset => (
              <Link
                to={'/wallet/assets'}
                key={asset.id}
                className="flex-between flex h-full gap-4 rounded-lg bg-bg-100 p-4 pl-6 pr-0 shadow-[4px_4px_10px_rgba(0,0,0,0.1)] transition-all hover:bg-bg-200 dark:bg-bg-800 dark:hover:bg-bg-700/50"
              >
                <div className="flex w-full min-w-0 items-center gap-4">
                  <div className="rounded-md bg-bg-700 p-2">
                    <Icon icon={asset.icon} className="size-6" />
                  </div>
                  <div className="flex w-full min-w-0 flex-col">
                    <div className="w-full min-w-0 truncate font-semibold">
                      {asset.name}
                    </div>
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
        )}
      </APIComponentWithFallback>
    </div>
  )
}
