/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Icon } from '@iconify/react'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import { useWalletContext } from '@providers/WalletProvider'
import { numberToMoney } from '@utils/strings'

function TransactionsCountCard(): React.ReactElement {
  const { transactions, isAmountHidden } = useWalletContext()
  const { t } = useTranslation()

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
    if (typeof transactions === 'string') {
      return {
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
    }

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
    <div className="col-span-1 row-span-2 flex h-full flex-col rounded-lg bg-bg-50 p-6 px-2 shadow-custom dark:bg-bg-900">
      <div className="flex-between flex px-4">
        <h1 className="flex items-center gap-2 text-xl font-semibold">
          <Icon icon="tabler:arrows-exchange" className="text-2xl" />
          <span className="ml-2">
            {t('dashboard.widgets.transactionsCount')}
          </span>
        </h1>
        <Link
          to="./transactions"
          className="flex items-center gap-2 rounded-lg p-2 text-bg-500 transition-all hover:bg-bg-100 hover:text-bg-800 dark:hover:bg-bg-700/30 dark:hover:text-bg-50"
        >
          <Icon icon="tabler:chevron-right" className="text-xl" />
        </Link>
      </div>
      <APIComponentWithFallback data={transactions}>
        {transactions => (
          <ul className="mt-6 space-y-2">
            {(
              [
                ['income', 'bg-green-500'],
                ['expenses', 'bg-red-500'],
                ['transfer', 'bg-blue-500']
              ] as const
            ).map(([type, color]) => (
              <Link
                key={type}
                to={`/wallet/transactions#type=${type}`}
                className="flex-between flex gap-4 rounded-md p-4 transition-all hover:bg-bg-100 dark:hover:bg-bg-800/50"
              >
                <div className="flex items-center gap-4">
                  <div className={`rounded-md ${color} size-4`}></div>
                  <div className="flex flex-col">
                    <div className="font-semibold ">
                      {t(`sidebar.wallet.${type}`)}
                    </div>
                    <div className="text-sm text-bg-500">
                      {amounts[type].count} {t('wallet.transactionCount')}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col">
                  <div
                    className={`flex gap-2 text-right font-medium ${
                      isAmountHidden ? 'items-center' : 'items-end'
                    }`}
                  >
                    - RM{' '}
                    {isAmountHidden ? (
                      <span className="flex items-center">
                        {Array(4)
                          .fill(0)
                          .map((_, i) => (
                            <Icon
                              key={i}
                              icon="uil:asterisk"
                              className="-mx-0.5 size-4"
                            />
                          ))}
                      </span>
                    ) : (
                      numberToMoney(amounts[type].amount)
                    )}
                  </div>
                  <div className="text-right text-sm text-bg-500">
                    {(
                      (amounts[type].amount /
                        transactions
                          .filter(transaction => transaction.amount)
                          .reduce(
                            (acc, curr) =>
                              acc +
                              curr.amount / (curr.type === 'transfer' ? 2 : 1),
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
        )}
      </APIComponentWithFallback>
    </div>
  )
}

export default TransactionsCountCard
