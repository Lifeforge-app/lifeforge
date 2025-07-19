import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { parse } from 'file-type-mime'
import {
  Button,
  CurrencyInput,
  DateInput,
  ImageAndFileInput,
  LocationInput,
  ModalHeader,
  TextInput
} from 'lifeforge-ui'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { fetchAPI } from 'shared/lib'
import { LocationsCustomSchemas } from 'shared/types/collections'

import { type IWalletTransaction } from '../../../../interfaces/wallet_interfaces'
import AssetsFromToSelector from './components/AssetsFromToSelector'
import AssetsSelector from './components/AssetsSelector'
import CategorySelector from './components/CategorySelector'
import LedgerSelector from './components/LedgerSelector'
import TransactionTypeSelector from './components/TransactionTypeSelector'

function ModifyTransactionsModal({
  data: { type, existedData },
  onClose
}: {
  data: {
    type: 'create' | 'update' | null
    existedData: Partial<IWalletTransaction> | null
  }
  onClose: () => void
}) {
  const { t } = useTranslation('apps.wallet')

  const queryClient = useQueryClient()

  const [particular, setParticular] = useState('')

  const [transactionType, setTransactionType] = useState<
    'income' | 'expenses' | 'transfer'
  >('income')

  const [transactionDate, setTransactionDate] = useState<Date | undefined>(
    undefined
  )

  const [amount, setAmount] = useState<number>(0)

  const [location, setLocation] =
    useState<LocationsCustomSchemas.ILocation | null>(null)

  const [category, setCategory] = useState<string | null>(null)

  const [transactionAsset, setTransactionAsset] = useState<string | null>(null)

  const [ledger, setLedger] = useState<string | null>(null)

  const [fromAsset, setFromAsset] = useState<string | null>(null)

  const [toAsset, setToAsset] = useState<string | null>(null)

  const [loading, setLoading] = useState(false)

  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null)

  const [receipt, setReceipt] = useState<File | string | null>(null)

  const [toRemoveReceipt, setToRemoveReceipt] = useState(false)

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
    if (type) {
      if (existedData) {
        setParticular(existedData.particulars ?? '')
        setTransactionType(existedData.type ?? 'income')
        setTransactionDate(
          existedData.date ? dayjs(existedData.date).toDate() : undefined
        )
        setAmount(existedData.amount ?? 0)
        setCategory(existedData.category || '')
        setLocation(
          existedData.location_name
            ? {
                name: existedData.location_name,
                location: existedData.location_coords
                  ? {
                      latitude: existedData.location_coords.lat,
                      longitude: existedData.location_coords.lon
                    }
                  : {
                      latitude: 0,
                      longitude: 0
                    },
                formattedAddress: ''
              }
            : null
        )
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
        setTransactionDate(dayjs().toDate())
        setAmount(0)
        setLocation(null)
        setCategory(null)
        setTransactionAsset(null)
        setLedger(null)
        setFromAsset(null)
        setToAsset(null)
        setReceipt(null)
        setImagePreviewUrl(null)
      }
    }
  }, [type, existedData])

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
    data.append('date', dayjs(transactionDate).format('YYYY-MM-DD'))
    data.append('amount', parseFloat(`${amount}` || '0').toString())
    data.append('category', category ?? '')
    data.append('location_name', location?.name ?? '')
    data.append('location_coords', JSON.stringify(location?.location))
    data.append('asset', transactionAsset ?? '')
    data.append('ledger', ledger ?? '')
    data.append('type', transactionType)
    data.append('side', transactionType === 'income' ? 'debit' : 'credit')
    data.append('fromAsset', fromAsset ?? '')
    data.append('toAsset', toAsset ?? '')

    if (type === 'update' && toRemoveReceipt) {
      data.append('removeReceipt', 'true')
    }

    if (receipt) data.append('file', receipt)

    setLoading(true)

    try {
      const res = await fetchAPI<IWalletTransaction[] | IWalletTransaction>(
        import.meta.env.VITE_API_HOST,
        `wallet/transactions${type === 'update' ? '/' + existedData?.id : ''}`,
        {
          method: type === 'create' ? 'POST' : 'PATCH',
          body: data
        }
      )

      queryClient.setQueryData<IWalletTransaction[]>(
        ['wallet', 'transactions'],
        prev => {
          if (!prev) return []

          if (type === 'create') {
            return [...(res as IWalletTransaction[]), ...prev].sort((a, b) => {
              if (dayjs(b.date).isSame(a.date)) {
                return dayjs(b.created).diff(a.created)
              }

              return dayjs(b.date).diff(a.date)
            })
          }

          return prev
            .map(item => {
              if (item.id === (res as IWalletTransaction).id) {
                return res as IWalletTransaction
              }

              return item
            })
            .sort((a, b) => {
              if (dayjs(b.date).isSame(a.date)) {
                return dayjs(b.created).diff(a.created)
              }

              return dayjs(b.date).diff(a.date)
            })
        }
      )

      queryClient.invalidateQueries({ queryKey: ['wallet', 'categories'] })
      queryClient.invalidateQueries({ queryKey: ['wallet', 'assets'] })
      queryClient.invalidateQueries({ queryKey: ['wallet', 'ledgers'] })
      onClose()
    } catch {
      toast.error('Failed to save transaction')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div ref={ref} className="min-w-[40vw]">
      <ModalHeader
        className="mb-4!"
        icon={type === 'create' ? 'tabler:plus' : 'tabler:pencil'}
        namespace="apps.wallet"
        title={`transactions.${type || ''}`}
        onClose={onClose}
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
          acceptedMimeTypes={{
            images: ['image/jpeg', 'image/png'],
            documents: ['application/pdf']
          }}
          icon="tabler:receipt"
          image={receipt}
          name="Receipt"
          namespace="apps.wallet"
          preview={imagePreviewUrl}
          reminderText={t('receiptUploadInfo')}
          setData={({ image, preview }) => {
            setReceipt(image)
            setImagePreviewUrl(preview)
          }}
          onImageRemoved={() => {
            if (type === 'update') setToRemoveReceipt(true)
          }}
        />
      </div>
      <Button
        className="mt-6 w-full"
        icon={type === 'create' ? 'tabler:plus' : 'tabler:pencil'}
        loading={loading}
        onClick={() => {
          onSubmitButtonClick().catch(console.error)
        }}
      >
        {type === 'create' ? 'Create' : 'Update'}
      </Button>
    </div>
  )
}

export default ModifyTransactionsModal
