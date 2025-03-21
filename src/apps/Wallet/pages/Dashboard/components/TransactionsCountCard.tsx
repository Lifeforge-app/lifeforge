import { Icon } from '@iconify/react'
import clsx from 'clsx'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import { DashboardItem, QueryWrapper, Scrollbar } from '@lifeforge/ui'

import { useWalletContext } from '@apps/Wallet/providers/WalletProvider'

import useComponentBg from '@hooks/useComponentBg'

function TransactionsCountCard() {
  const { componentBgLighterWithHover } = useComponentBg()
  const { transactionsQuery, isAmountHidden } = useWalletContext()
  const { t } = useTranslation('apps.wallet')

  const transactions = transactionsQuery.data ?? []

  const amounts = useMemo<{
    income: {
      amount: number
      count: number
    }
    expenses: {
      amount: number
      count: number
    }
    transfer: {
      amount: number
      count: number
    }
  }>(() => {
    return transactions.reduce(
      (acc, transaction) => {
        if (transaction.type === 'income') {
          acc.income.amount += transaction.amount
          acc.income.count++
        } else if (transaction.type === 'expenses') {
          acc.expenses.amount += transaction.amount
          acc.expenses.count++
        }
        if (transaction.type === 'transfer') {
          acc.transfer.amount += transaction.amount / 2
          acc.transfer.count += 0.5
        }

        return acc
      },
      {
        income: {
          amount: 0,
          count: 0
        },
        expenses: {
          amount: 0,
          count: 0
        },
        transfer: {
          amount: 0,
          count: 0
        }
      }
    )
  }, [transactions])

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
                  className={clsx(
                    'flex-between flex flex-col gap-4 rounded-md p-4 transition-all sm:flex-row',
                    componentBgLighterWithHover
                  )}
                  to={`/wallet/transactions?type=${type}`}
                >
                  <div className="flex w-full items-center gap-4">
                    <div
                      className={clsx('size-4 shrink-0 rounded-md', color)}
                    ></div>
                    <div className="flex flex-col">
                      <div className="font-semibold">
                        {t(`transactionTypes.${type}`)}
                      </div>
                      <div className="text-bg-500 text-sm">
                        {amounts[type].count} {t('transactionCount')}
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
                        amounts[type].amount.toFixed(2)
                      )}
                    </div>
                    <div className="text-bg-500 text-right text-sm">
                      {(
                        (amounts[type].amount /
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
