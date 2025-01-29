import { parse } from 'file-type-mime'

import moment from 'moment'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { CreateOrModifyButton } from '@components/buttons'
import {
  CurrencyInput,
  DateInput,
  ImageAndFileInput,
  ImagePickerModal,
  TextInput
} from '@components/inputs'
import ModalHeader from '@components/modals/ModalHeader'
import ModalWrapper from '@components/modals/ModalWrapper'
import { type IWalletTransaction } from '@interfaces/wallet_interfaces'
import { useWalletContext } from '@providers/WalletProvider'
import APIRequest from '@utils/fetchData'
import AssetsFromToSelector from './components/AssetsFromToSelector'
import AssetsSelector from './components/AssetsSelector'
import CategorySelector from './components/CategorySelector'
import LedgerSelector from './components/LedgerSelector'
import LocationSelector from './components/LocationSelector'
import TransactionTypeSelector from './components/TransactionTypeSelector'

function ModifyTransactionsModal({
  openType,
  setOpenType,
  existedData,
  setExistedData
}: {
  openType: 'create' | 'update' | null
  setOpenType: React.Dispatch<React.SetStateAction<'create' | 'update' | null>>
  existedData: IWalletTransaction | null
  setExistedData: React.Dispatch<
    React.SetStateAction<IWalletTransaction | null>
  >
}): React.ReactElement {
  const { t } = useTranslation()
  const { refreshAssets, refreshTransactions } = useWalletContext()
  const [particular, setParticular] = useState('')
  const [transactionType, setTransactionType] = useState<
    'income' | 'expenses' | 'transfer'
  >('income')

  const [transactionDate, setTransactionDate] = useState<string>('')
  const [amount, setAmount] = useState<string>()
  const [location, setLocation] = useState<string | null>(null)
  const [category, setCategory] = useState<string | null>(null)
  const [transactionAsset, setTransactionAsset] = useState<string | null>(null)
  const [ledger, setLedger] = useState<string | null>(null)
  const [fromAsset, setFromAsset] = useState<string | null>(null)
  const [toAsset, setToAsset] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null)
  const [receipt, setReceipt] = useState<File | string | null>(null)
  const [toRemoveReceipt, setToRemoveReceipt] = useState(false)
  const [isImagePickerModalOpen, setIsImagePickerModalOpen] = useState(false)

  const ref = useRef<HTMLInputElement>(null)

  async function getImagePreview(file: File): Promise<void> {
    const mime = parse(await file.arrayBuffer())
    if (mime?.mime.includes('image')) {
      const reader = new FileReader()
      reader.onload = () => {
        setImagePreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setImagePreviewUrl(null)
    }
  }

  useEffect(() => {
    if (openType) {
      if (existedData) {
        setParticular(existedData.particulars)
        setTransactionType(existedData.type)
        setTransactionDate(moment(existedData.date).format('YYYY-MM-DD'))
        setAmount(`${existedData.amount}`)
        setCategory(existedData.category || '')
        setLocation(existedData.location || '')
        setTransactionAsset(existedData.asset || '')
        setLedger(existedData.ledger || '')
        setReceipt(
          existedData.receipt instanceof File ? existedData.receipt : null
        )
        if (existedData.receipt instanceof File) {
          getImagePreview(existedData.receipt).catch(console.error)
        } else {
          setImagePreviewUrl(
            existedData.receipt
              ? `${import.meta.env.VITE_API_HOST}/media/${
                  existedData.collectionId
                }/${existedData.id}/${existedData.receipt}`
              : null
          )
        }
        setFromAsset(null)
        setToAsset(null)
      } else {
        setParticular('')
        setTransactionType('income')
        setTransactionDate(moment().format('YYYY-MM-DD'))
        setAmount(undefined)
        setLocation('')
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

  async function onSubmitButtonClick(): Promise<void> {
    if (transactionType === 'transfer') {
      if (!fromAsset || !toAsset) {
        toast.error('Please fill in the from and to assets.')
        return
      }
    } else {
      if (
        particular.trim().length === 0 ||
        !transactionDate ||
        !amount ||
        !category ||
        !transactionAsset
      ) {
        toast.error('Please fill in the particulars, date, and amount.')
        return
      }
    }

    const data = new FormData()
    data.append('particulars', particular)
    data.append('date', moment(transactionDate).format('YYYY-MM-DD'))
    data.append('amount', parseFloat(`${amount}` || '0').toString())
    data.append('category', category ?? '')
    data.append('location', location ?? '')

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
      endpoint: `wallet/transactions${
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
      <ModalWrapper modalRef={ref} isOpen={openType !== null} minWidth="40vw">
        <ModalHeader
          icon={openType === 'create' ? 'tabler:plus' : 'tabler:pencil'}
          title={openType === 'create' ? 'Add Transaction' : 'Edit Transaction'}
          onClose={() => {
            setOpenType(null)
            setExistedData(null)
          }}
          className="mb-4!"
        />
        <div className="space-y-4">
          <TransactionTypeSelector
            transactionType={transactionType}
            setTransactionType={(type: 'income' | 'expenses' | 'transfer') => {
              setTransactionType(type)
              setCategory(null)
            }}
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
          <DateInput
            modalRef={ref}
            name="Date"
            date={transactionDate}
            setDate={setTransactionDate}
            icon="tabler:calendar"
            darker
          />
          {transactionType !== 'transfer' && (
            <TextInput
              icon="tabler:file-text"
              placeholder="My Transactions"
              value={particular}
              darker
              name="Particulars"
              className="mt-4"
              updateValue={setParticular}
            />
          )}
          <CurrencyInput
            icon="tabler:currency-dollar"
            name="Amount"
            value={amount}
            updateValue={setAmount}
            placeholder="0.00"
            darker
            className="mt-4"
          />
          {transactionType !== 'transfer' && (
            <>
              <LocationSelector location={location} setLocation={setLocation} />
              <CategorySelector
                transactionType={transactionType}
                category={category}
                setCategory={setCategory}
              />
              <LedgerSelector ledger={ledger} setLedger={setLedger} />
            </>
          )}
          <ImageAndFileInput
            icon="tabler:receipt"
            name="Receipt"
            image={receipt}
            setImage={setReceipt}
            preview={imagePreviewUrl}
            setPreview={setImagePreviewUrl}
            setImagePickerModalOpen={setIsImagePickerModalOpen}
            onImageRemoved={() => {
              if (openType === 'update') setToRemoveReceipt(true)
            }}
            reminderText={t('wallet.receiptUploadInfo')}
          />
        </div>
        <CreateOrModifyButton
          loading={loading}
          onClick={() => {
            onSubmitButtonClick().catch(console.error)
          }}
          type={openType === 'update' ? 'update' : 'create'}
        />
      </ModalWrapper>
      <ImagePickerModal
        isOpen={isImagePickerModalOpen}
        onClose={() => {
          setIsImagePickerModalOpen(false)
        }}
        onSelect={async (file, preview) => {
          if (typeof file === 'string') return

          setReceipt(file)
          setImagePreviewUrl(preview)
        }}
        acceptedMimeTypes={{
          images: ['image/jpeg', 'image/png'],
          documents: ['application/pdf']
        }}
      />
    </>
  )
}

export default ModifyTransactionsModal
