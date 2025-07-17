import { Icon } from '@iconify/react/dist/iconify.js'
import dayjs from 'dayjs'

import {
  IWalletCategory,
  IWalletTransaction
} from '@apps/Wallet/interfaces/wallet_interfaces'

function Header({
  transaction,
  category
}: {
  transaction: IWalletTransaction
  category?: IWalletCategory
}) {
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
        <span className="text-bg-500 mr-2">
          {transaction.side === 'debit' ? '+' : '-'}
        </span>
        RM{' '}
        {Intl.NumberFormat('en-MY', {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2
        }).format(transaction.amount)}
      </div>
      <p className="text-center text-lg">{transaction.particulars}</p>
      <p className="text-bg-500 mt-2 text-center">
        {dayjs(transaction.date).format('dddd, D MMM YYYY')}
      </p>
    </div>
  )
}

export default Header
