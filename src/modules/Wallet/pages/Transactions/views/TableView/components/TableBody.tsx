import React from 'react'
import { type IWalletTransaction } from '@interfaces/wallet_interfaces'
import { useWalletContext } from '@providers/WalletProvider'
import ActionColumn from './columns/ActionColumn'
import AmountColumn from './columns/AmountColumn'
import AssetColumn from './columns/AssetColumn'
import CategoryColumn from './columns/CategoryColumn'
import DateColumn from './columns/DateColumn'
import LedgerColumn from './columns/LedgerColumn'
import LocationColumn from './columns/LocationColumn'
import ParticularsColumn from './columns/ParticularsColumn'
import ReceiptColumn from './columns/ReceiptColumn'
import TypeColumn from './columns/TypeColumn'

function TableBody({
  visibleColumn,
  setSelectedData,
  setModifyModalOpenType,
  setDeleteTransactionsConfirmationOpen
}: {
  visibleColumn: string[]
  setSelectedData: React.Dispatch<
    React.SetStateAction<IWalletTransaction | null>
  >
  setModifyModalOpenType: React.Dispatch<
    React.SetStateAction<'create' | 'update' | null>
  >
  setDeleteTransactionsConfirmationOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >
}): React.ReactElement {
  const {
    assets,
    ledgers,
    categories,
    filteredTransactions: transactions
  } = useWalletContext()

  return (
    <tbody>
      {transactions.map(transaction => (
        <tr
          key={transaction.id}
          className="border-b border-bg-200 dark:border-bg-800"
        >
          {(() => {
            const columns: Array<[string, React.FC<any>, Record<string, any>]> =
              [
                ['Date', DateColumn, { date: transaction.date }],
                ['Type', TypeColumn, { type: transaction.type }],
                [
                  'Ledger',
                  LedgerColumn,
                  { ledger: transaction.ledger, ledgers }
                ],
                ['Asset', AssetColumn, { asset: transaction.asset, assets }],
                [
                  'Particulars',
                  ParticularsColumn,
                  { particulars: transaction.particulars }
                ],
                [
                  'Location',
                  LocationColumn,
                  { location: transaction.location }
                ],
                [
                  'Category',
                  CategoryColumn,
                  { category: transaction.category, categories }
                ],
                [
                  'Amount',
                  AmountColumn,
                  { side: transaction.side, amount: transaction.amount }
                ],
                [
                  'Receipt',
                  ReceiptColumn,
                  {
                    receipt: transaction.receipt,
                    collectionId: transaction.collectionId,
                    id: transaction.id
                  }
                ]
              ]

            return columns.map(([columnId, Component, props]) => {
              if (!visibleColumn.includes(columnId)) return <></>
              return <Component key={columnId} {...props} />
            })
          })()}

          <ActionColumn
            transaction={transaction}
            setSelectedData={setSelectedData}
            setModifyModalOpenType={setModifyModalOpenType}
            setDeleteTransactionsConfirmationOpen={
              setDeleteTransactionsConfirmationOpen
            }
          />
        </tr>
      ))}
    </tbody>
  )
}

export default TableBody
