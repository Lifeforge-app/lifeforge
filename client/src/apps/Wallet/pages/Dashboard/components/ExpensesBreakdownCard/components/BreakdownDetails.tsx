import { Icon } from '@iconify/react'
import clsx from 'clsx'
import { Scrollbar } from 'lifeforge-ui'
import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import { useWalletStore } from '@apps/Wallet/stores/useWalletStore'
import numberToCurrency from '@apps/Wallet/utils/numberToCurrency'

import { ExpensesBreakdownContext } from '..'

function BreakdownDetails() {
  const { t } = useTranslation('apps.wallet')

  const { isAmountHidden } = useWalletStore()

  const { spentOnEachCategory, expensesCategories } = useContext(
    ExpensesBreakdownContext
  )

  return (
    <div className="h-full min-h-96 xl:min-h-0">
      <Scrollbar className="mb-4">
        <ul className="divide-bg-200 dark:divide-bg-800 flex flex-col divide-y">
          {expensesCategories.map(category => (
            <Link
              key={category.id}
              className="flex-between hover:bg-bg-100 dark:hover:bg-bg-800/50 flex gap-3 rounded-md p-4 transition-all"
              to={`/wallet/transactions?type=expenses&category=${category.id}`}
            >
              <div className="flex items-center gap-3">
                <div
                  className="rounded-md bg-blue-500/20 p-2"
                  style={{
                    backgroundColor: category.color + '20',
                    color: category.color
                  }}
                >
                  <Icon className="size-6" icon={category.icon} />
                </div>
                <div className="flex flex-col">
                  <div className="font-semibold">{category.name}</div>
                  <div className="text-bg-500 text-sm">
                    {spentOnEachCategory[category.id]?.count}{' '}
                    {t('transactionCount')}
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                <div
                  className={clsx(
                    'flex gap-2 text-right font-medium',
                    isAmountHidden ? 'items-center' : 'items-end'
                  )}
                >
                  - RM{' '}
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
                    numberToCurrency(spentOnEachCategory[category.id]?.amount)
                  )}
                </div>
                <div className="text-bg-500 text-right text-sm">
                  {spentOnEachCategory[category.id]?.percentage.toFixed(2)}%
                </div>
              </div>
            </Link>
          ))}
        </ul>
      </Scrollbar>
    </div>
  )
}

export default BreakdownDetails
