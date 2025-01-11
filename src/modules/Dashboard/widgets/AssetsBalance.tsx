import { Icon } from '@iconify/react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Button from '@components/ButtonsAndInputs/Button'
import DashboardItem from '@components/Miscellaneous/DashboardItem'
import APIFallbackComponent from '@components/Screens/APIComponentWithFallback'
import useFetch from '@hooks/useFetch'
import useThemeColors from '@hooks/useThemeColor'
import { type IWalletAsset } from '@interfaces/wallet_interfaces'
import { numberToMoney } from '@utils/strings'

export default function AssetsBalance(): React.ReactElement {
  const { t } = useTranslation()
  const { componentBgLighterWithHover } = useThemeColors()
  const [assets] = useFetch<IWalletAsset[]>('wallet/assets')
  const [showBalance, setShowBalance] = useState(false)

  return (
    <DashboardItem
      icon="tabler:wallet"
      title={t('dashboard.widgets.assetsBalance.title')}
      componentBesideTitle={
        <Button
          variant="no-bg"
          onClick={() => {
            setShowBalance(!showBalance)
          }}
          icon={!showBalance ? 'tabler:eye-off' : 'tabler:eye'}
          className="!p-2"
        />
      }
    >
      <APIFallbackComponent data={assets}>
        {assets => (
          <ul className="grid h-full grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-2 overflow-y-auto">
            {assets.map(asset => (
              <Link
                to={'/wallet/assets'}
                key={asset.id}
                className={`flex-between flex h-full gap-4 rounded-lg bg-bg-100 p-2 pl-4 pr-0 shadow-[4px_4px_10px_rgba(0,0,0,0.1)] transition-all ${componentBgLighterWithHover}`}
              >
                <div className="flex w-full min-w-0 items-center gap-4">
                  <div className="rounded-md bg-bg-200 p-2 dark:bg-bg-700">
                    <Icon
                      icon={asset.icon}
                      className="size-6 text-bg-500 dark:text-bg-100"
                    />
                  </div>
                  <div className="flex w-full min-w-0 flex-col">
                    <div className="w-full min-w-0 truncate font-semibold">
                      {asset.name}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-bg-500">
                      RM{' '}
                      {showBalance ? (
                        numberToMoney(asset.balance)
                      ) : (
                        <span className="flex items-center">
                          {Array(4)
                            .fill(0)
                            .map((_, i) => (
                              <Icon
                                key={i}
                                icon="uil:asterisk"
                                className="size-3"
                              />
                            ))}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button className="rounded-lg p-4 text-bg-300 transition-all dark:text-bg-700">
                  <Icon icon="tabler:chevron-right" className="text-xl" />
                </button>
              </Link>
            ))}
          </ul>
        )}
      </APIFallbackComponent>
    </DashboardItem>
  )
}
