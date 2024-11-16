/* eslint-disable @typescript-eslint/member-delimiter-style */
import React from 'react'
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer'
import List from 'react-virtualized/dist/commonjs/List'
import Scrollbar from '@components/Miscellaneous/Scrollbar'
import { type IWalletTransaction } from '@interfaces/wallet_interfaces'
import { useWalletContext } from '@providers/WalletProvider'
import TransactionListItem from './components/TransactionListItem'

const AS = AutoSizer as any
const L = List as any

function ListView({
  setSelectedData,
  setModifyModalOpenType,
  setDeleteTransactionsConfirmationOpen,
  setReceiptModalOpen,
  setReceiptToView
}: {
  setSelectedData: React.Dispatch<
    React.SetStateAction<IWalletTransaction | null>
  >
  setModifyModalOpenType: React.Dispatch<'create' | 'update' | null>
  setDeleteTransactionsConfirmationOpen: React.Dispatch<boolean>
  setReceiptModalOpen: React.Dispatch<boolean>
  setReceiptToView: React.Dispatch<string>
}): React.ReactElement {
  const { filteredTransactions: transactions } = useWalletContext()

  return (
    <>
      <Scrollbar>
        <AS>
          {({ height, width }: { height: number; width: number }) => (
            <L
              width={width}
              height={height - 36}
              rowCount={transactions.length}
              rowHeight={80}
              rowRenderer={({
                index,
                key,
                style
              }: {
                index: number
                key: string
                style: React.CSSProperties
              }) => {
                const transaction = transactions[index]

                return (
                  <div key={key} style={style}>
                    <TransactionListItem
                      transaction={transaction}
                      setModifyModalOpenType={setModifyModalOpenType}
                      setDeleteTransactionsConfirmationOpen={
                        setDeleteTransactionsConfirmationOpen
                      }
                      setReceiptModalOpen={setReceiptModalOpen}
                      setReceiptToView={setReceiptToView}
                      setSelectedData={setSelectedData}
                    />
                  </div>
                )
              }}
            />
          )}
        </AS>
      </Scrollbar>
    </>
  )
}

export default ListView
