import { Icon } from '@iconify/react/dist/iconify.js'
import clsx from 'clsx'
import dayjs from 'dayjs'

import { QueryWrapper } from '@lifeforge/ui'

import { IWalletCategory } from '@apps/Wallet/interfaces/wallet_interfaces'
import { useWalletContext } from '@apps/Wallet/providers/WalletProvider'

function ListView({ categories }: { categories: IWalletCategory[] }) {
  const { transactionsQuery } = useWalletContext()

  return (
    <QueryWrapper query={transactionsQuery}>
      {transactions => (
        <ul className="divide-bg-800/50 flex flex-col divide-y lg:hidden">
          {transactions.slice(0, 20).map(transaction => (
            <li key={transaction.id} className="flex-between flex gap-8 p-4">
              <div className="flex w-full min-w-0 items-center gap-4">
                <div
                  className={clsx(
                    'rounded-md p-2',
                    transaction.type === 'transfer' &&
                      'bg-blue-500/20 text-blue-500'
                  )}
                  style={{
                    backgroundColor:
                      categories.find(
                        category => category.id === transaction.category
                      )?.color + '20',
                    color: categories.find(
                      category => category.id === transaction.category
                    )?.color
                  }}
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
                    {transaction.particulars}
                  </div>
                  <div className="text-bg-500 text-sm">
                    {transaction.type[0].toUpperCase() +
                      transaction.type.slice(1)}
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                <div className="text-right">
                  <span
                    className={clsx(
                      transaction.side === 'debit'
                        ? 'text-green-500'
                        : 'text-red-500'
                    )}
                  >
                    {transaction.side === 'debit' ? '+' : '-'}
                    {transaction.amount.toFixed(2)}
                  </span>
                </div>
                <div className="text-bg-500 whitespace-nowrap text-right text-sm">
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
