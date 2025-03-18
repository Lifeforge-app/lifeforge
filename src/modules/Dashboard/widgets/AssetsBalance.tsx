import { Icon } from '@iconify/react'
import clsx from 'clsx'
import { useState } from 'react'
import { Link } from 'react-router'

import { APIFallbackComponent, Button, DashboardItem } from '@lifeforge/ui'

import useComponentBg from '@hooks/useComponentBg'
import { useWalletContext } from '@modules/Wallet/providers/WalletProvider'

export default function AssetsBalance() {
  const {assets} = useWalletContext()  
  const { componentBgLighterWithHover } = useComponentBg()
  const [showBalance, setShowBalance] = useState(false)

  return (
    <DashboardItem
      componentBesideTitle={
        <Button
          className="p-2!"
          icon={!showBalance ? 'tabler:eye-off' : 'tabler:eye'}
          variant="plain"
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
                className={clsx(
                  'flex-between bg-bg-100 flex h-full gap-4 rounded-lg p-2 pl-4 pr-0 shadow-[4px_4px_10px_rgba(0,0,0,0.1)] transition-all',
                  componentBgLighterWithHover
                )}
                to={'/wallet/assets'}
              >
                <div className="flex w-full min-w-0 items-center gap-4">
                  <div className="bg-bg-200 dark:bg-bg-700 rounded-md p-2">
                    <Icon
                      className="text-bg-500 dark:text-bg-100 size-6"
                      icon={asset.icon}
                    />
                  </div>
                  <div className="flex w-full min-w-0 flex-col">
                    <div className="w-full min-w-0 truncate font-semibold">
                      {asset.name}
                    </div>
                    <div className="text-bg-500 flex items-center gap-1 text-sm">
                      RM{' '}
                      {showBalance ? (
                        asset.balance.toFixed(2)
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
                <button className="text-bg-300 dark:text-bg-700 rounded-lg p-4 transition-all">
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
