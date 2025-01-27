import { Icon } from '@iconify/react'
import React from 'react'
import { Link } from 'react-router-dom'
import { type IWalletLedger } from '@interfaces/wallet_interfaces'

function LedgerColumn({
  ledger,
  ledgers
}: {
  ledger: string
  ledgers: IWalletLedger[]
}): React.ReactElement {
  return (
    <td className="p-2 text-center">
      {ledger !== '' ? (
        <Link
          to={`/wallet/transactions?ledger=${ledger}`}
          className="inline-flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-1 text-sm"
          style={{
            backgroundColor: ledgers.find(l => l.id === ledger)?.color + '20',
            color: ledgers.find(l => l.id === ledger)?.color
          }}
        >
          <Icon
            icon={ledgers.find(l => l.id === ledger)?.icon ?? ''}
            className="size-4"
          />
          {ledgers.find(l => l.id === ledger)?.name}
        </Link>
      ) : (
        '-'
      )}
    </td>
  )
}

export default LedgerColumn
