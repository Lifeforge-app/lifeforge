import { Icon } from '@iconify/react'
import { useWalletData } from '@modules/wallet/client/hooks/useWalletData'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { WithQuery } from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import TransactionAmount from '../../components/TransactionAmount'
import TransactionParticular from '../../components/TransactionParticular'

function TableView() {
  const { t } = useTranslation('apps.wallet')

  const { transactionsQuery, categoriesQuery } = useWalletData()

  const categories = categoriesQuery.data ?? []

  return (
    <WithQuery query={transactionsQuery}>
      {transactions => (
        <table className="hidden w-full text-base! lg:table">
          <thead>
            <tr className="border-bg-200 text-bg-500 dark:border-bg-800 border-b-2 text-center text-base">
              {['date', 'type', 'particulars', 'category', 'amount'].map(
                header => (
                  <th
                    key={header}
                    className={clsx(
                      'py-2 font-medium',
                      header === 'particulars' ? 'text-left' : 'text-center'
                    )}
                  >
                    {t(`table.${header}`)}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {transactions.slice(0, 25).map(transaction => {
              return (
                <tr
                  key={transaction.id}
                  className="border-bg-200 dark:border-bg-800 border-b"
                >
                  <td className="py-2 text-center whitespace-nowrap">
                    {dayjs(transaction.date).format('MMM DD')}
                  </td>
                  <td className="py-4 text-center">
                    <Link
                      className={clsx('rounded-full px-3 py-1 text-sm', {
                        'bg-green-500/20 text-green-500':
                          transaction.type === 'income',
                        'bg-red-500/20 text-red-500':
                          transaction.type === 'expenses',
                        'bg-blue-500/20 text-blue-500':
                          transaction.type === 'transfer'
                      })}
                      to={`/wallet/transactions?type=${transaction.type}`}
                    >
                      {transaction.type[0].toUpperCase() +
                        transaction.type.slice(1)}
                    </Link>
                  </td>
                  <td className="max-w-64 truncate py-2">
                    <TransactionParticular transaction={transaction} />
                  </td>
                  <td className="py-2 text-center">
                    {transaction.type !== 'transfer' ? (
                      <Link
                        className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm whitespace-nowrap"
                        style={{
                          backgroundColor:
                            categories.find(
                              category => category.id === transaction.category
                            )?.color + '20',
                          color: categories.find(
                            category => category.id === transaction.category
                          )?.color
                        }}
                        to={`/wallet/transactions?category=${transaction.category}`}
                      >
                        <Icon
                          className="size-4"
                          icon={
                            categories.find(
                              category => category.id === transaction.category
                            )?.icon ?? 'tabler:currency-dollar'
                          }
                        />
                        {categories.find(
                          category => category.id === transaction.category
                        )?.name ?? '-'}
                      </Link>
                    ) : (
                      <span className="text-bg-400 dark:text-bg-600">-</span>
                    )}
                  </td>
                  <td className="py-2 text-center">
                    <TransactionAmount
                      amount={transaction.amount}
                      type={transaction.type}
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </WithQuery>
  )
}

export default TableView
