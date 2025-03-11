import { Icon } from '@iconify/react'
import { useWalletContext } from '@providers/WalletProvider'
import { numberToMoney } from '@utils/strings'
import clsx from 'clsx'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router'

import {
  APIFallbackComponent,
  DashboardItem,
  EmptyStateScreen,
  Scrollbar
} from '@lifeforge/ui'

import useThemeColors from '@hooks/useThemeColor'

function AssetsBalanceCard(): React.ReactElement {
  const { componentBgLighterWithHover } = useThemeColors()
  const navigate = useNavigate()
  const { assets, isAmountHidden } = useWalletContext()
  const { t } = useTranslation('modules.wallet')

  return (
    <DashboardItem
      className="col-span-1 row-span-2 min-h-96 xl:min-h-0"
      componentBesideTitle={
        <Link
          className="text-bg-500 hover:bg-bg-100 hover:text-bg-800 dark:hover:bg-bg-700/30 dark:hover:text-bg-50 flex items-center gap-2 rounded-lg p-2 transition-all"
          to="./assets"
        >
          <Icon className="text-xl" icon="tabler:chevron-right" />
        </Link>
      }
      icon="tabler:wallet"
      namespace="modules.wallet"
      title="Assets Balance"
    >
      <APIFallbackComponent data={assets}>
        {assets =>
          assets.length > 0 ? (
            <Scrollbar>
              <ul className="flex flex-col gap-3 pb-2">
                {assets.map(asset => (
                  <Link
                    key={asset.id}
                    className={clsx(
                      'flex-between shadow-custom flex w-full min-w-0 flex-1 flex-col gap-4 rounded-lg p-6 transition-all [@media(min-width:400px)]:flex-row',
                      componentBgLighterWithHover
                    )}
                    to={`/wallet/transactions?asset=${asset.id}`}
                  >
                    <div className="flex w-full min-w-0 items-center gap-4">
                      <Icon className="size-6 shrink-0" icon={asset.icon} />
                      <div className="w-full min-w-0 truncate font-semibold">
                        {asset.name}
                      </div>
                    </div>
                    <div
                      className={clsx(
                        'flex gap-2 whitespace-nowrap text-right text-3xl font-medium',
                        isAmountHidden ? 'items-center' : 'items-end'
                      )}
                    >
                      <span className="text-bg-500 text-xl">RM</span>
                      {isAmountHidden ? (
                        <span className="flex items-center">
                          {Array(4)
                            .fill(0)
                            .map((_, i) => (
                              <Icon
                                key={i}
                                className="-mx-0.5 size-4"
                                icon="uil:asterisk"
                              />
                            ))}
                        </span>
                      ) : (
                        <span>{numberToMoney(+asset.balance)}</span>
                      )}
                    </div>
                  </Link>
                ))}
              </ul>
            </Scrollbar>
          ) : (
            <EmptyStateScreen
              smaller
              ctaContent="new"
              ctaTProps={{
                item: t('items.asset')
              }}
              icon="tabler:wallet-off"
              name="assets"
              namespace="modules.wallet"
              onCTAClick={() => {
                navigate('/wallet/assets')
              }}
            />
          )
        }
      </APIFallbackComponent>
    </DashboardItem>
  )
}

export default AssetsBalanceCard
