import { Icon } from '@iconify/react'
import moment from 'moment'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { Link } from 'react-router-dom'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/Screens/EmptyStateScreen'
import Scrollbar from '@components/Scrollbar'
import { useWalletContext } from '@providers/WalletProvider'
import { numberToMoney } from '@utils/strings'

function TransactionsCard(): React.ReactElement {
  const { transactions, categories } = useWalletContext()
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <div className="col-span-2 row-span-3 flex h-full flex-col rounded-lg bg-bg-50 p-6 shadow-custom dark:bg-bg-900">
      <div className="flex-between flex gap-4">
        <h1 className="flex w-full items-center gap-2 text-xl font-semibold sm:w-auto">
          <Icon icon="tabler:list" className="text-2xl" />
          <span className="ml-2">
            {t('dashboard.widgets.recentTransactions.title')}
          </span>
        </h1>
        <button
          onClick={() => {
            navigate('/wallet/transactions')
          }}
          className="flex items-center gap-2 rounded-lg p-2 font-medium text-bg-500 transition-all hover:bg-bg-100 hover:text-bg-800 dark:hover:bg-bg-700/30 dark:hover:text-bg-100"
        >
          <Icon icon="tabler:chevron-right" className="text-xl" />
        </button>
      </div>
      <APIComponentWithFallback data={transactions}>
        {transactions => (
          <APIComponentWithFallback data={categories}>
            {categories => (
              <div className="mt-6 size-full min-h-96">
                <Scrollbar>
                  {transactions.length > 0 ? (
                    <>
                      <table className="hidden w-full !text-base lg:table">
                        <thead>
                          <tr className="border-b-2 border-bg-200 text-center text-base text-bg-500 dark:border-bg-800">
                            {[
                              'date',
                              'type',
                              'particulars',
                              'category',
                              'amount'
                            ].map(header => (
                              <th
                                key={header}
                                className={`py-2 font-medium ${
                                  header === 'particulars'
                                    ? 'text-left'
                                    : 'text-center'
                                }`}
                              >
                                {t(`table.${header}`)}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {transactions.slice(0, 20).map(transaction => {
                            return (
                              <tr
                                key={transaction.id}
                                className="border-b border-bg-200 dark:border-bg-800"
                              >
                                <td className="whitespace-nowrap py-2 text-center">
                                  {moment(transaction.date).format('MMM DD')}
                                </td>
                                <td className="py-4 text-center">
                                  <Link
                                    to={`/wallet/transactions?type=${transaction.type}`}
                                    className={`rounded-full px-3 py-1 text-sm ${
                                      {
                                        income:
                                          'bg-green-500/20 text-green-500',
                                        expenses: 'bg-red-500/20 text-red-500',
                                        transfer: 'bg-blue-500/20 text-blue-500'
                                      }[transaction.type]
                                    }`}
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
                                      to={`/wallet/transactions?category=${transaction.category}`}
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
                                    >
                                      <Icon
                                        icon={
                                          categories.find(
                                            category =>
                                              category.id ===
                                              transaction.category
                                          )?.icon ?? 'tabler:currency-dollar'
                                        }
                                        className="size-4"
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
                                    className={`${
                                      transaction.side === 'debit'
                                        ? 'text-green-500'
                                        : 'text-red-500'
                                    }`}
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
                      <ul className="flex flex-col divide-y divide-bg-800/70 lg:hidden">
                        {transactions.slice(0, 20).map(transaction => (
                          <li
                            key={transaction.id}
                            className="flex-between flex gap-8 p-4"
                          >
                            <div className="flex w-full min-w-0 items-center gap-4">
                              <div
                                className={`rounded-md p-2 ${
                                  transaction.type === 'transfer' &&
                                  'bg-blue-500/20 text-blue-500'
                                }`}
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
                                  icon={
                                    transaction.type === 'transfer'
                                      ? 'tabler:transfer'
                                      : categories.find(
                                          category =>
                                            category.id === transaction.category
                                        )?.icon ?? 'tabler:currency-dollar'
                                  }
                                  className={'size-6'}
                                />
                              </div>
                              <div className="flex w-full min-w-0 flex-col">
                                <div className="w-full min-w-0 truncate font-semibold">
                                  {transaction.particulars}
                                </div>
                                <div className="text-sm text-bg-500">
                                  {transaction.type[0].toUpperCase() +
                                    transaction.type.slice(1)}
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col">
                              <div className="text-right">
                                <span
                                  className={`${
                                    transaction.side === 'debit'
                                      ? 'text-green-500'
                                      : 'text-red-500'
                                  }`}
                                >
                                  {transaction.side === 'debit' ? '+' : '-'}
                                  {numberToMoney(transaction.amount)}
                                </span>
                              </div>
                              <div className="whitespace-nowrap text-right text-sm text-bg-500">
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
                      title={t('emptyState.wallet.transactions.title')}
                      description={t(
                        'emptyState.wallet.transactions.description'
                      )}
                    />
                  )}
                </Scrollbar>
              </div>
            )}
          </APIComponentWithFallback>
        )}
      </APIComponentWithFallback>
    </div>
  )
}

export default TransactionsCard
