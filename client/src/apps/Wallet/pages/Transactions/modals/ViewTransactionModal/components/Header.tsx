import { Icon } from '@iconify/react'
import dayjs from 'dayjs'
import { useMemo } from 'react'

import { useWalletData } from '@apps/Wallet/hooks/useWalletData'
import TransactionAmount from '@apps/Wallet/pages/Dashboard/components/TransactionsCard/components/TransactionAmount'

import { IWalletTransaction } from '../../..'

function Header({ transaction }: { transaction: IWalletTransaction }) {
  const { categoriesQuery } = useWalletData()

  const category = useMemo(
    () =>
      transaction.type === 'transfer'
        ? null
        : categoriesQuery.data?.find(
            category => category.id === transaction.category
          ),
    [transaction, categoriesQuery.data]
  )

  return (
    <div className="flex-center flex flex-col">
      {category && (
        <div
          className="shadow-custom mb-6 w-min rounded-lg p-4"
          style={{
            backgroundColor: category.color + (category.color ? '50' : ''),
            color: category.color
          }}
        >
          <Icon className="size-8" icon={category.icon ?? ''} />
        </div>
      )}
      {transaction.type === 'transfer' && (
        <div className="mb-6 w-min rounded-lg bg-blue-500/20 p-4">
          <Icon
            className="size-8 text-blue-500"
            icon="tabler:arrows-exchange"
          />
        </div>
      )}
      <div className="mb-2 text-center text-4xl font-medium">
        <TransactionAmount
          amount={transaction.amount}
          type={transaction.type}
        />
      </div>
      <p className="text-center text-lg">{transaction.particulars}</p>
      <p className="text-bg-500 mt-2 text-center">
        {dayjs(transaction.date).format('dddd, D MMM YYYY')}
      </p>
    </div>
  )
}

export default Header
