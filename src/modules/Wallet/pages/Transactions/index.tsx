import { Icon } from '@iconify/react/dist/iconify.js'
import moment from 'moment'
import React, { useState } from 'react'
import Button from '@components/ButtonsAndInputs/Button'
import DeleteConfirmationModal from '@components/Modals/DeleteConfirmationModal'
import ModuleHeader from '@components/Module/ModuleHeader'
import ModuleWrapper from '@components/Module/ModuleWrapper'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/Screens/EmptyStateScreen'
import useFetch from '@hooks/useFetch'
import {
  type IWalletAssetEntry,
  type IWalletCategoryEntry,
  type IWalletTransactionEntry
} from '@typedec/Wallet'
import ModifyTransactionsModal from './components/ModifyTransactionsModal'

function Transactions(): React.ReactElement {
  const [transactions, refreshTransactions] = useFetch<
    IWalletTransactionEntry[]
  >('wallet/transactions/list')
  const [assets] = useFetch<IWalletAssetEntry[]>('wallet/assets/list')
  const [categories] = useFetch<IWalletCategoryEntry[]>('wallet/category/list')
  const [modifyTransactionsModalOpenType, setModifyModalOpenType] = useState<
    'create' | 'update' | null
  >(null)
  const [
    deleteTransactionsConfirmationOpen,
    setDeleteTransactionsConfirmationOpen
  ] = useState(false)
  const [selectedData, setSelectedData] =
    useState<IWalletTransactionEntry | null>(null)

  return (
    <ModuleWrapper>
      <ModuleHeader
        title="Transactions"
        desc="Manage your Transactions here."
        actionButton={
          typeof transactions !== 'string' &&
          transactions.length > 0 && (
            <Button
              onClick={() => {
                setModifyModalOpenType('create')
              }}
              icon="tabler:plus"
            >
              Add Transaction
            </Button>
          )
        }
      />
      <APIComponentWithFallback data={transactions}>
        {typeof transactions !== 'string' &&
        typeof categories !== 'string' &&
        typeof assets !== 'string' &&
        transactions.length > 0 ? (
          <table className="mt-8 w-full">
            <thead>
              <tr className="border-b-2 border-bg-800 text-bg-500">
                <th className="py-2">Date</th>
                <th className="py-2">Type</th>
                <th className="py-2 text-left">Particular</th>
                <th className="py-2">Category</th>
                <th className="py-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(transaction => (
                <tr key={transaction.id} className="border-b border-bg-800">
                  <td className="py-2 text-center">
                    {moment(transaction.date).format('MMM DD, YYYY')}
                  </td>
                  <td className="py-4 text-center">
                    <span
                      className={`rounded-full px-3 py-1 text-sm ${
                        {
                          income: 'bg-green-500/20 text-green-500',
                          expenses: 'bg-red-500/20 text-red-500',
                          transfer: 'bg-blue-500/20 text-blue-500'
                        }[transaction.type]
                      }
                      `}
                    >
                      {transaction.type[0].toUpperCase() +
                        transaction.type.slice(1)}
                    </span>
                  </td>
                  <td className="py-2">{transaction.particulars}</td>
                  <td className="py-2 text-center">
                    {transaction.category !== '' ? (
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm ${
                          categories.find(
                            category => category.id === transaction.category
                          )?.color + '20'
                        }`}
                      >
                        <Icon
                          icon={
                            categories.find(
                              category => category.id === transaction.category
                            )?.icon ?? ''
                          }
                          className="h-4 w-4"
                        />
                        {
                          categories.find(
                            category => category.id === transaction.category
                          )?.name
                        }
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="py-2 text-center">
                    <span
                      className={`${
                        {
                          income: 'text-green-500',
                          expenses: 'text-red-500',
                          transfer: 'text-blue-500'
                        }[transaction.type]
                      }
                      `}
                    >
                      {transaction.type === 'income'
                        ? '+'
                        : transaction.type === 'transfer'
                        ? ''
                        : '-'}
                      {transaction.amount.toFixed(2)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <EmptyStateScreen
            title="Oops! No Transaction found."
            description="You don't have any Transactions yet. Add some to get started."
            ctaContent="Add Transaction"
            setModifyModalOpenType={setModifyModalOpenType}
            icon="tabler:wallet-off"
          />
        )}
      </APIComponentWithFallback>
      <ModifyTransactionsModal
        existedData={selectedData}
        setExistedData={setSelectedData}
        openType={modifyTransactionsModalOpenType}
        setOpenType={setModifyModalOpenType}
        refreshTransactions={refreshTransactions}
      />
      <DeleteConfirmationModal
        apiEndpoint="wallet/Transactions/delete"
        isOpen={deleteTransactionsConfirmationOpen}
        data={selectedData}
        itemName="transaction account"
        onClose={() => {
          setDeleteTransactionsConfirmationOpen(false)
          setSelectedData(null)
        }}
        updateDataList={refreshTransactions}
        nameKey="name"
      />
    </ModuleWrapper>
  )
}

export default Transactions
