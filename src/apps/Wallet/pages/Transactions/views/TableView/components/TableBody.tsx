import { useWalletContext } from '@apps/Wallet/providers/WalletProvider'

import { type IWalletTransaction } from '../../../../../interfaces/wallet_interfaces'
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
}) {
  const {
    assetsQuery,
    ledgersQuery,
    categoriesQuery,
    filteredTransactions: transactions
  } = useWalletContext()
  const ledgers = ledgersQuery.data ?? []
  const assets = assetsQuery.data ?? []
  const categories = categoriesQuery.data ?? []

  return (
    <tbody>
      {transactions.map(transaction => (
        <tr
          key={transaction.id}
          className="border-bg-200 dark:border-bg-800 border-b"
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
            setDeleteTransactionsConfirmationOpen={
              setDeleteTransactionsConfirmationOpen
            }
            setModifyModalOpenType={setModifyModalOpenType}
            setSelectedData={setSelectedData}
            transaction={transaction}
          />
        </tr>
      ))}
    </tbody>
  )
}

export default TableBody
