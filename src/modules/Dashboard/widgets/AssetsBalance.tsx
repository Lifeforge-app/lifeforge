import { Icon } from '@iconify/react'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@components/buttons'
import APIFallbackComponent from '@components/screens/APIComponentWithFallback'
import DashboardItem from '@components/utilities/DashboardItem'
import useFetch from '@hooks/useFetch'
import useThemeColors from '@hooks/useThemeColor'
import { type IWalletAsset } from '@interfaces/wallet_interfaces'
import { numberToMoney } from '@utils/strings'

export default function AssetsBalance(): React.ReactElement {
  const { componentBgLighterWithHover } = useThemeColors()
  const [assets] = useFetch<IWalletAsset[]>('wallet/assets')
  const [showBalance, setShowBalance] = useState(false)

  return (
    <DashboardItem
      componentBesideTitle={
        <Button
          className="p-2!"
          icon={!showBalance ? 'tabler:eye-off' : 'tabler:eye'}
          variant="no-bg"
          onClick={() => {
            setShowBalance(!showBalance)
          }}
        />
      }
      icon="tabler:wallet"
      title="Assets Balance"
    >
      <APIFallbackComponent data={assets}>
        {assets => (
          <ul className="grid h-full grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-2 overflow-y-auto">
            {assets.map(asset => (
              <Link
                key={asset.id}
                className={`flex-between flex h-full gap-4 rounded-lg bg-bg-100 p-2 pl-4 pr-0 shadow-[4px_4px_10px_rgba(0,0,0,0.1)] transition-all ${componentBgLighterWithHover}`}
                to={'/wallet/assets'}
              >
                <div className="flex w-full min-w-0 items-center gap-4">
                  <div className="rounded-md bg-bg-200 p-2 dark:bg-bg-700">
                    <Icon
                      className="size-6 text-bg-500 dark:text-bg-100"
                      icon={asset.icon}
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
                                className="size-3"
                                icon="uil:asterisk"
                              />
                            ))}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button className="rounded-lg p-4 text-bg-300 transition-all dark:text-bg-700">
                  <Icon className="text-xl" icon="tabler:chevron-right" />
                </button>
              </Link>
            ))}
          </ul>
        )}
      </APIFallbackComponent>
    </DashboardItem>
  )
}
