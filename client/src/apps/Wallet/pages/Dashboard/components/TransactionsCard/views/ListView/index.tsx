import { Icon } from '@iconify/react'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { QueryWrapper } from 'lifeforge-ui'

import { useWalletData } from '@apps/Wallet/hooks/useWalletData'

import TransactionAmount from '../../components/TransactionAmount'
import TransactionParticular from '../../components/TransactionParticular'

function ListView() {
  const { transactionsQuery, categoriesQuery } = useWalletData()

  const categories = categoriesQuery.data ?? []

  return (
    <QueryWrapper query={transactionsQuery}>
      {transactions => (
        <ul className="divide-bg-800/50 flex flex-col divide-y lg:hidden">
          {transactions.slice(0, 20).map(transaction => (
            <li key={transaction.id} className="flex-between flex gap-8 p-4">
              <div className="flex w-full min-w-0 items-center gap-3">
                <div
                  className={clsx(
                    'rounded-md p-2',
                    transaction.type === 'transfer' &&
                      'bg-blue-500/20 text-blue-500'
                  )}
                  style={
                    transaction.type !== 'transfer'
                      ? {
                          backgroundColor:
                            categories.find(
                              category => category.id === transaction.category
                            )?.color + '20',
                          color: categories.find(
                            category => category.id === transaction.category
                          )?.color
                        }
                      : undefined
                  }
                >
                  <Icon
                    className="size-6"
                    icon={
                      transaction.type === 'transfer'
                        ? 'tabler:transfer'
                        : (categories.find(
                            category => category.id === transaction.category
                          )?.icon ?? 'tabler:currency-dollar')
                    }
                  />
                </div>
                <div className="flex w-full min-w-0 flex-col">
                  <div className="w-full min-w-0 truncate font-semibold">
                    <TransactionParticular transaction={transaction} />
                  </div>
                  <div className="text-bg-500 text-sm">
                    {transaction.type[0].toUpperCase() +
                      transaction.type.slice(1)}
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                <div className="text-right">
                  <TransactionAmount
                    amount={transaction.amount}
                    type={transaction.type}
                  />
                </div>
                <div className="text-bg-500 text-right text-sm whitespace-nowrap">
                  {dayjs(transaction.date).format('MMM DD, YYYY')}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </QueryWrapper>
  )
}

export default ListView
