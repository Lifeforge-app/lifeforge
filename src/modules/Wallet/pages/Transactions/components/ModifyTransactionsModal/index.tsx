/* eslint-disable @typescript-eslint/prefer-optional-chain */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import CreateOrModifyButton from '@components/ButtonsAndInputs/CreateOrModifyButton'
import CurrencyInputComponent from '@components/ButtonsAndInputs/CurrencyInput'
import DateInput from '@components/ButtonsAndInputs/DateInput'
import Input from '@components/ButtonsAndInputs/Input'
import Modal from '@components/Modals/Modal'
import ModalHeader from '@components/Modals/ModalHeader'
import { type IWalletTransactionEntry } from '@interfaces/wallet_interfaces'
import { useWalletContext } from '@providers/WalletProvider'
import APIRequest from '@utils/fetchData'
import AssetsFromToSelector from './components/AssetsFromToSelector'
import AssetsSelector from './components/AssetsSelector'
import CategorySelector from './components/CategorySelector'
import LedgerSelector from './components/LedgerSelector'
import ReceiptUploader from './components/ReceiptUploader'
import TransactionTypeSelector from './components/TransactionTypeSelector'

function ModifyTransactionsModal({
  openType,
  setOpenType,
  existedData,
  setExistedData
}: {
  openType: 'create' | 'update' | null
  setOpenType: React.Dispatch<React.SetStateAction<'create' | 'update' | null>>
  existedData: IWalletTransactionEntry | null
  setExistedData: React.Dispatch<
    React.SetStateAction<IWalletTransactionEntry | null>
  >
}): React.ReactElement {
  const { refreshAssets, refreshTransactions } = useWalletContext()
  const [particular, setParticular] = useState('')
  const [transactionType, setTransactionType] = useState<
    'income' | 'expenses' | 'transfer'
  >('income')

  const [transactionDate, setTransactionDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  )
  const [amount, setAmount] = useState<string>()
  const [category, setCategory] = useState<string | null>(null)
  const [transactionAsset, setTransactionAsset] = useState<string | null>(null)
  const [ledger, setLedger] = useState<string | null>(null)
  const [fromAsset, setFromAsset] = useState<string | null>(null)
  const [toAsset, setToAsset] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null)
  const [receipt, setReceipt] = useState<File | null>(null)
  const [toRemoveReceipt, setToRemoveReceipt] = useState<boolean>(false)

  useEffect(() => {
    if (openType) {
      if (openType === 'update') {
        if (existedData) {
          setParticular(existedData.particulars)
          setTransactionType(existedData.type)
          setTransactionDate(existedData.date)
          setAmount(`${existedData.amount}`)
          setCategory(existedData.category)
          setTransactionAsset(existedData.asset)
          setLedger(existedData.ledger)
          setReceipt(null)
          setImagePreviewUrl(
            existedData.receipt
              ? `${import.meta.env.VITE_API_HOST}/media/${
                  existedData.collectionId
                }/${existedData.id}/${existedData.receipt}`
              : ''
          )
        }
      } else {
        setParticular('')
        setTransactionType('income')
        setTransactionDate(new Date().toISOString().split('T')[0])
        setAmount(undefined)
        setCategory(null)
        setTransactionAsset(null)
        setLedger(null)
        setFromAsset(null)
        setToAsset(null)
        setReceipt(null)
        setImagePreviewUrl(null)
      }
    }
  }, [openType, existedData])

  useEffect(() => {
    setCategory(null)
  }, [transactionType])

  function updateTransactionName(e: React.ChangeEvent<HTMLInputElement>): void {
    setParticular(e.target.value)
  }

  async function onSubmitButtonClick(): Promise<void> {
    if (transactionType === 'transfer') {
      if (!fromAsset || !toAsset) {
        toast.error('Please fill in the from and to assets.')
        return
      }
    } else {
      if (particular.trim().length === 0 || !transactionDate || !amount) {
        toast.error('Please fill in the particulars, date, and amount.')
        return
      }
    }

    const data = new FormData()
    data.append('particulars', particular)
    data.append('date', moment(transactionDate).format('YYYY-MM-DD'))
    data.append('amount', parseFloat(`${amount}` ?? '0').toString())
    data.append('category', category ?? '')

    data.append('asset', transactionAsset ?? '')
    data.append('ledger', ledger ?? '')
    data.append('type', transactionType)
    data.append('side', transactionType === 'income' ? 'debit' : 'credit')
    data.append('fromAsset', fromAsset ?? '')
    data.append('toAsset', toAsset ?? '')

    if (openType === 'update' && toRemoveReceipt) {
      data.append('removeReceipt', 'true')
    }

    if (receipt) data.append('file', receipt)

    setLoading(true)
    await APIRequest({
      endpoint: `wallet/transactions/${openType}${
        openType === 'update' ? `/${existedData?.id}` : ''
      }`,
      method: openType === 'create' ? 'POST' : 'PATCH',
      body: data,
      isJSON: false,
      successInfo: openType,
      failureInfo: openType,
      callback: () => {
        refreshTransactions()
        refreshAssets()
        setExistedData(null)
        setOpenType(null)
      },
      finalCallback: () => {
        setLoading(false)
      }
    })
  }

  return (
    <>
      <Modal isOpen={openType !== null} minWidth="40vw">
        <ModalHeader
          icon={openType === 'create' ? 'tabler:plus' : 'tabler:pencil'}
          title={openType === 'create' ? 'Add Transaction' : 'Edit Transaction'}
          onClose={() => {
            setOpenType(null)
          }}
        />
        <TransactionTypeSelector
          transactionType={transactionType}
          setTransactionType={setTransactionType}
          openType={openType}
        />
        {transactionType === 'income' || transactionType === 'expenses' ? (
          <AssetsSelector
            transactionAsset={transactionAsset}
            setTransactionAsset={setTransactionAsset}
          />
        ) : (
          <AssetsFromToSelector
            fromAsset={fromAsset}
            setFromAsset={setFromAsset}
            toAsset={toAsset}
            setToAsset={setToAsset}
          />
        )}
        {transactionType !== 'transfer' && (
          <Input
            icon="tabler:file-text"
            placeholder="My Transactions"
            value={particular}
            darker
            name="Particulars"
            updateValue={updateTransactionName}
          />
        )}
        <DateInput
          name="Date"
          date={transactionDate}
          setDate={setTransactionDate}
          icon="tabler:calendar"
        />
        <CurrencyInputComponent
          icon="tabler:currency-dollar"
          name="Amount"
          value={amount}
          updateValue={setAmount}
          placeholder="0.00"
          darker
          additionalClassName="mt-4"
        />
        {transactionType !== 'transfer' && (
          <>
            <CategorySelector
              transactionType={transactionType}
              category={category}
              setCategory={setCategory}
              openType={openType}
            />
            <LedgerSelector
              ledger={ledger}
              setLedger={setLedger}
              openType={openType}
            />
          </>
        )}
        <ReceiptUploader
          imagePreviewUrl={imagePreviewUrl}
          setImagePreviewUrl={setImagePreviewUrl}
          setReceipt={setReceipt}
          setToRemoveReceipt={setToRemoveReceipt}
          openType={openType}
        />
        <CreateOrModifyButton
          loading={loading}
          onClick={() => {
            onSubmitButtonClick().catch(console.error)
          }}
          type={openType === 'update' ? 'update' : 'create'}
        />
      </Modal>
    </>
  )
}

export default ModifyTransactionsModal
