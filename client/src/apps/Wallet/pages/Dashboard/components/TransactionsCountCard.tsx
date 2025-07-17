import { Icon } from '@iconify/react'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import { DashboardItem, QueryWrapper, Scrollbar } from '@lifeforge/ui'

import { useWalletData } from '@apps/Wallet/hooks/useWalletData'
import { useWalletStore } from '@apps/Wallet/stores/useWalletStore'
import numberToCurrency from '@apps/Wallet/utils/numberToCurrency'

function TransactionsCountCard() {
  const { transactionsQuery, typesCountQuery } = useWalletData()
  const { isAmountHidden } = useWalletStore()
  const { t } = useTranslation('apps.wallet')
  const typesCount = typesCountQuery.data ?? {}

  return (
    <DashboardItem
      className="col-span-1 row-span-1 min-h-96 xl:min-h-0"
      componentBesideTitle={
        <Link
          className="text-bg-500 hover:bg-bg-100 hover:text-bg-800 dark:hover:bg-bg-700/30 dark:hover:text-bg-50 flex items-center gap-2 rounded-lg p-2 transition-all"
          to="./transactions"
        >
          <Icon className="text-xl" icon="tabler:chevron-right" />
        </Link>
      }
      icon="tabler:arrows-exchange"
      namespace="apps.wallet"
      title="Transactions Count"
    >
      <QueryWrapper query={transactionsQuery}>
        {transactions => (
          <Scrollbar>
            <ul className="space-y-2">
              {(
                [
                  ['income', 'bg-green-500'],
                  ['expenses', 'bg-red-500'],
                  ['transfer', 'bg-blue-500']
                ] as const
              ).map(([type, color]) => (
                <Link
                  key={type}
                  className="flex-between component-bg-lighter-with-hover flex flex-col gap-3 rounded-md p-4 transition-all sm:flex-row"
                  to={`/wallet/transactions?type=${type}`}
                >
                  <div className="flex w-full items-center gap-3">
                    <div
                      className={clsx('size-4 shrink-0 rounded-md', color)}
                    ></div>
                    <div className="flex flex-col">
                      <div className="font-semibold">
                        {t(`transactionTypes.${type}`)}
                      </div>
                      <div className="text-bg-500 text-sm">
                        {typesCount[type].amount} {t('transactionCount')}
                      </div>
                    </div>
                  </div>
                  <div className="flex w-full flex-row items-center justify-between sm:w-auto sm:flex-col sm:items-end">
                    <div
                      className={clsx(
                        'flex gap-2 text-right font-medium whitespace-nowrap',
                        isAmountHidden ? 'items-center' : 'items-end'
                      )}
                    >
                      {{
                        income: '+',
                        expenses: '-',
                        transfer: ' '
                      }[type] || ''}{' '}
                      RM{' '}
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
                        numberToCurrency(typesCount[type].accumulate)
                      )}
                    </div>
                    <div className="text-bg-500 text-right text-sm">
                      {(
                        (typesCount[type].accumulate /
                          (type === 'transfer' ? 2 : 1) /
                          transactions
                            .filter(transaction => transaction.amount)
                            .reduce(
                              (acc, curr) =>
                                acc +
                                curr.amount /
                                  (curr.type === 'transfer' ? 2 : 1),
                              0
                            )) *
                          100 || 0
                      ).toFixed(2)}
                      %
                    </div>
                  </div>
                </Link>
              ))}
            </ul>
          </Scrollbar>
        )}
      </QueryWrapper>
    </DashboardItem>
  )
}

export default TransactionsCountCard
