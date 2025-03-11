import { Icon } from '@iconify/react'
import { useWalletContext } from '@providers/WalletProvider'
import { numberToMoney } from '@utils/strings'
import clsx from 'clsx'
import moment from 'moment'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import {
  APIFallbackComponent,
  DashboardItem,
  EmptyStateScreen,
  Scrollbar
} from '@lifeforge/ui'

function TransactionsCard(): React.ReactElement {
  const { transactions, categories } = useWalletContext()
  const { t } = useTranslation('modules.wallet')

  return (
    <DashboardItem
      className="col-span-2 row-span-3"
      componentBesideTitle={
        <Link
          className="text-bg-500 hover:bg-bg-100 hover:text-bg-800 dark:hover:bg-bg-700/30 dark:hover:text-bg-50 flex items-center gap-2 rounded-lg p-2 font-medium transition-all"
          to="/wallet/transactions"
        >
          <Icon className="text-xl" icon="tabler:chevron-right" />
        </Link>
      }
      icon="tabler:list"
      namespace="modules.wallet"
      title="Recent Transactions"
    >
      <APIFallbackComponent data={transactions}>
        {transactions => (
          <APIFallbackComponent data={categories}>
            {categories => (
              <div className="size-full min-h-96 xl:min-h-0">
                <Scrollbar>
                  {transactions.length > 0 ? (
                    <>
                      <table className="text-base! hidden w-full lg:table">
                        <thead>
                          <tr className="border-bg-200 text-bg-500 dark:border-bg-800 border-b-2 text-center text-base">
                            {[
                              'date',
                              'type',
                              'particulars',
                              'category',
                              'amount'
                            ].map(header => (
                              <th
                                key={header}
                                className={clsx(
                                  'py-2 font-medium',
                                  header === 'particulars'
                                    ? 'text-left'
                                    : 'text-center'
                                )}
                              >
                                {t(`table.${header}`)}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {transactions.slice(0, 25).map(transaction => {
                            return (
                              <tr
                                key={transaction.id}
                                className="border-bg-200 dark:border-bg-800 border-b"
                              >
                                <td className="whitespace-nowrap py-2 text-center">
                                  {moment(transaction.date).format('MMM DD')}
                                </td>
                                <td className="py-4 text-center">
                                  <Link
                                    className={clsx(
                                      'rounded-full px-3 py-1 text-sm',
                                      {
                                        'bg-green-500/20 text-green-500':
                                          transaction.type === 'income',
                                        'bg-red-500/20 text-red-500':
                                          transaction.type === 'expenses',
                                        'bg-blue-500/20 text-blue-500':
                                          transaction.type === 'transfer'
                                      }
                                    )}
                                    to={`/wallet/transactions?type=${transaction.type}`}
                                  >
                                    {transaction.type[0].toUpperCase() +
                                      transaction.type.slice(1)}
                                  </Link>
                                </td>
                                <td className="max-w-64 truncate py-2">
                                  {transaction.particulars}
                                </td>
                                <td className="py-2 text-center">
                                  {transaction.category !== '' ? (
                                    <Link
                                      className="inline-flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-1 text-sm"
                                      style={{
                                        backgroundColor:
                                          categories.find(
                                            category =>
                                              category.id ===
                                              transaction.category
                                          )?.color + '20',
                                        color: categories.find(
                                          category =>
                                            category.id === transaction.category
                                        )?.color
                                      }}
                                      to={`/wallet/transactions?category=${transaction.category}`}
                                    >
                                      <Icon
                                        className="size-4"
                                        icon={
                                          categories.find(
                                            category =>
                                              category.id ===
                                              transaction.category
                                          )?.icon ?? 'tabler:currency-dollar'
                                        }
                                      />
                                      {categories.find(
                                        category =>
                                          category.id === transaction.category
                                      )?.name ?? '-'}
                                    </Link>
                                  ) : (
                                    '-'
                                  )}
                                </td>
                                <td className="py-2 text-center">
                                  <span
                                    className={clsx(
                                      transaction.side === 'debit'
                                        ? 'text-green-500'
                                        : 'text-red-500'
                                    )}
                                  >
                                    {transaction.side === 'debit' ? '+' : '-'}
                                    {numberToMoney(transaction.amount)}
                                  </span>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                      <ul className="divide-bg-800/50 flex flex-col divide-y lg:hidden">
                        {transactions.slice(0, 20).map(transaction => (
                          <li
                            key={transaction.id}
                            className="flex-between flex gap-8 p-4"
                          >
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
                                      category =>
                                        category.id === transaction.category
                                    )?.color + '20',
                                  color: categories.find(
                                    category =>
                                      category.id === transaction.category
                                  )?.color
                                }}
                              >
                                <Icon
                                  className="size-6"
                                  icon={
                                    transaction.type === 'transfer'
                                      ? 'tabler:transfer'
                                      : (categories.find(
                                          category =>
                                            category.id === transaction.category
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
                                  {numberToMoney(transaction.amount)}
                                </span>
                              </div>
                              <div className="text-bg-500 whitespace-nowrap text-right text-sm">
                                {moment(transaction.date).format(
                                  'MMM DD, YYYY'
                                )}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <EmptyStateScreen
                      name="transactions"
                      namespace="modules.wallet"
                    />
                  )}
                </Scrollbar>
              </div>
            )}
          </APIFallbackComponent>
        )}
      </APIFallbackComponent>
    </DashboardItem>
  )
}

export default TransactionsCard
