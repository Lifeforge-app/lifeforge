import { useQueryClient } from '@tanstack/react-query'
import { parse } from 'file-type-mime'
import moment from 'moment'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import {
  Button,
  CurrencyInput,
  DateInput,
  ImageAndFileInput,
  ImagePickerModal,
  LocationInput,
  ModalHeader,
  ModalWrapper,
  TextInput
} from '@lifeforge/ui'

import fetchAPI from '@utils/fetchAPI'

import { type IWalletTransaction } from '../../../../interfaces/wallet_interfaces'
import AssetsFromToSelector from './components/AssetsFromToSelector'
import AssetsSelector from './components/AssetsSelector'
import CategorySelector from './components/CategorySelector'
import LedgerSelector from './components/LedgerSelector'
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
}) {
  const { t } = useTranslation('apps.wallet')
  const queryClient = useQueryClient()
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

  async function getImagePreview(file: File) {
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

  async function onSubmitButtonClick() {
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
        toast.error('Please fill in required fields.')
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

    try {
      const res = await fetchAPI<IWalletTransaction>(
        `wallet/transactions${
          openType === 'update' ? `/${existedData?.id}` : ''
        }`,
        {
          method: openType === 'create' ? 'POST' : 'PATCH',
          body: data
        }
      )

      queryClient.setQueryData<IWalletTransaction[]>(
        ['wallet', 'transactions'],
        prev => {
          if (openType === 'create') {
            return prev ? [...prev, res] : [res]
          }

          if (openType === 'update') {
            return prev?.map(transaction =>
              transaction.id === res.id ? res : transaction
            )
          }
        }
      )

      queryClient.invalidateQueries({ queryKey: ['wallet', 'transactions'] })
      setExistedData(null)
      setOpenType(null)
    } catch {
      toast.error('Failed to save transaction')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <ModalWrapper isOpen={openType !== null} minWidth="40vw" modalRef={ref}>
        <ModalHeader
          className="mb-4!"
          icon={openType === 'create' ? 'tabler:plus' : 'tabler:pencil'}
          namespace="apps.wallet"
          title={`transactions.${openType || ''}`}
          onClose={() => {
            setOpenType(null)
            setExistedData(null)
          }}
        />
        <div className="space-y-4">
          <TransactionTypeSelector
            setTransactionType={(type: 'income' | 'expenses' | 'transfer') => {
              setTransactionType(type)
              setCategory(null)
              setTransactionAsset(null)
              setFromAsset(null)
              setToAsset(null)
            }}
            transactionType={transactionType}
          />
          {transactionType === 'income' || transactionType === 'expenses' ? (
            <AssetsSelector
              setTransactionAsset={setTransactionAsset}
              transactionAsset={transactionAsset}
            />
          ) : (
            <AssetsFromToSelector
              fromAsset={fromAsset}
              setFromAsset={setFromAsset}
              setToAsset={setToAsset}
              toAsset={toAsset}
            />
          )}
          <DateInput
            darker
            required
            date={transactionDate}
            icon="tabler:calendar"
            modalRef={ref}
            name="Date"
            namespace="apps.wallet"
            setDate={setTransactionDate}
          />
          {transactionType !== 'transfer' && (
            <TextInput
              darker
              required
              className="mt-4"
              icon="tabler:file-text"
              name="Particulars"
              namespace="apps.wallet"
              placeholder="My Transactions"
              setValue={setParticular}
              value={particular}
            />
          )}
          <CurrencyInput
            darker
            required
            className="mt-4"
            icon="tabler:currency-dollar"
            name="Amount"
            namespace="apps.wallet"
            placeholder="0.00"
            setValue={setAmount}
            value={amount}
          />
          {transactionType !== 'transfer' && (
            <>
              <LocationInput
                location={location}
                namespace="apps.wallet"
                setLocation={setLocation}
              />
              <CategorySelector
                category={category}
                setCategory={setCategory}
                transactionType={transactionType}
              />
              <LedgerSelector ledger={ledger} setLedger={setLedger} />
            </>
          )}
          <ImageAndFileInput
            icon="tabler:receipt"
            image={receipt}
            name="Receipt"
            namespace="apps.wallet"
            preview={imagePreviewUrl}
            reminderText={t('receiptUploadInfo')}
            setImage={setReceipt}
            setImagePickerModalOpen={setIsImagePickerModalOpen}
            setPreview={setImagePreviewUrl}
            onImageRemoved={() => {
              if (openType === 'update') setToRemoveReceipt(true)
            }}
          />
        </div>
        <Button
          icon={openType === 'create' ? 'tabler:plus' : 'tabler:pencil'}
          loading={loading}
          onClick={() => {
            onSubmitButtonClick().catch(console.error)
          }}
        >
          {openType === 'create' ? 'Create' : 'Update'}
        </Button>
      </ModalWrapper>
      <ImagePickerModal
        acceptedMimeTypes={{
          images: ['image/jpeg', 'image/png'],
          documents: ['application/pdf']
        }}
        isOpen={isImagePickerModalOpen}
        onClose={() => {
          setIsImagePickerModalOpen(false)
        }}
        onSelect={async (file, preview) => {
          if (typeof file === 'string') return

          setReceipt(file)
          setImagePreviewUrl(preview)
        }}
      />
    </>
  )
}

export default ModifyTransactionsModal
