import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { FormModal } from 'lifeforge-ui'
import {
  type SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react'

import { useWalletData } from '@apps/Wallet/hooks/useWalletData'

import type { WalletTransaction } from '../..'

function ModifyTransactionsModal({
  data: { type, initialData },
  onClose
}: {
  data: {
    type: 'create' | 'update' | null
    initialData:
      | ({
          type: WalletTransaction['type']
        } & Partial<WalletTransaction>)
      | null
  }
  onClose: () => void
}) {
  const queryClient = useQueryClient()

  const { assetsQuery, categoriesQuery, ledgersQuery } = useWalletData()

  const assets = assetsQuery.data ?? []

  const categories = categoriesQuery.data ?? []

  const ledgers = ledgersQuery.data ?? []

  const [toRemoveReceipt, setToRemoveReceipt] = useState<boolean>(false)

  const [baseFormState, setBaseFormState] = useState<{
    type: WalletTransaction['type']
    date: Date
    amount: number
    receipt: {
      image: string | File | null
      preview: string | null
    }
  }>({
    type: 'expenses',
    date: dayjs().toDate(),
    amount: 0,
    receipt: {
      image: null,
      preview: null
    }
  })

  const [incomeExpensesFormState, setIncomeExpensesFormState] = useState<
    Omit<
      WalletCollectionsSchemas.ITransactionsIncomeExpense,
      'location_name' | 'location_coords' | 'base_transaction' | 'type'
    > & {
      location: LocationsCustomSchemas.ILocation | undefined
    }
  >({
    category: '',
    asset: '',
    ledgers: [],
    particulars: '',
    location: undefined
  })

  const [transferFormState, setTransferFormState] = useState<
    Omit<WalletCollectionsSchemas.ITransactionsTransfer, 'base_transaction'>
  >({
    from: '',
    to: ''
  })

  const fields = useMemo<IFieldProps[]>(() => {
    const BASE_FIELD_PROPS: IFieldProps<typeof baseFormState>[] = [
      {
        id: 'type',
        label: 'Transaction Type',
        type: 'listbox',
        options: [
          { text: 'Income', value: 'income', icon: 'tabler:login-2' },
          { text: 'Expenses', value: 'expenses', icon: 'tabler:logout-2' },
          { text: 'Transfer', value: 'transfer', icon: 'tabler:transfer' }
        ],
        icon: 'tabler:exchange',
        required: true
      },
      {
        id: 'date',
        label: 'Date',
        type: 'datetime',
        required: true,
        icon: 'tabler:calendar'
      },
      {
        id: 'amount',
        label: 'Amount',
        type: 'currency',
        required: true,
        icon: 'tabler:currency-dollar'
      }
    ]

    if (baseFormState.type === 'transfer') {
      const _state = {
        ...baseFormState,
        ...transferFormState
      }

      const fieldProps: IFieldProps<typeof _state>[] = [
        ...BASE_FIELD_PROPS,
        {
          id: 'from',
          label: 'From Asset',
          type: 'listbox',
          options: assets.map(asset => ({
            text: asset.name,
            value: asset.id,
            icon: asset.icon
          })),
          icon: 'tabler:arrow-left-circle'
        },
        {
          id: 'to',
          label: 'To Asset',
          type: 'listbox',
          options: assets.map(asset => ({
            text: asset.name,
            value: asset.id,
            icon: asset.icon
          })),
          icon: 'tabler:arrow-right-circle'
        },
        {
          id: 'receipt',
          label: 'Receipt',
          type: 'file',
          required: false,
          onFileRemoved: () => setToRemoveReceipt(true)
        }
      ]

      return fieldProps
    } else {
      const _state = {
        ...baseFormState,
        ...incomeExpensesFormState
      }

      const fieldProps: IFieldProps<typeof _state>[] = [
        ...BASE_FIELD_PROPS,
        {
          id: 'particulars',
          label: 'Particulars',
          type: 'text',
          required: true,
          icon: 'tabler:file-description',
          placeholder: 'Enter details about the transaction'
        },
        {
          id: 'category',
          label: 'Category',
          type: 'listbox',
          options: categories
            .filter(cat => cat.type === baseFormState.type)
            .map(category => ({
              text: category.name,
              value: category.id,
              icon: category.icon,
              color: category.color
            })),
          icon: 'tabler:category',
          required: true
        },
        {
          id: 'asset',
          label: 'Asset',
          type: 'listbox',
          options: assets.map(asset => ({
            text: asset.name,
            value: asset.id,
            icon: asset.icon
          })),
          icon: 'tabler:coin',
          required: true
        },
        {
          id: 'ledgers',
          label: 'Ledger',
          type: 'listbox',
          options: ledgers.map(ledger => ({
            text: ledger.name,
            value: ledger.id,
            icon: ledger.icon,
            color: ledger.color
          })),
          icon: 'tabler:book',
          required: false,
          multiple: true
        },
        {
          id: 'location',
          label: 'Location',
          type: 'location'
        },
        {
          id: 'receipt',
          label: 'Receipt',
          type: 'file',
          required: false,
          onFileRemoved: () => setToRemoveReceipt(true)
        }
      ]

      return fieldProps
    }
  }, [
    baseFormState,
    incomeExpensesFormState,
    transferFormState,
    assets,
    categories,
    ledgers
  ])

  const formState = useMemo(() => {
    if (baseFormState.type === 'transfer') {
      return {
        ...baseFormState,
        ...transferFormState,
        type: 'transfer' as const
      }
    }

    return {
      ...baseFormState,
      ...incomeExpensesFormState,
      type: baseFormState.type as 'income' | 'expenses'
    }
  }, [baseFormState, transferFormState, incomeExpensesFormState])

  const handleChange = useCallback(
    (newState: SetStateAction<typeof formState>) => {
      const currentState =
        baseFormState.type === 'transfer'
          ? { ...baseFormState, ...transferFormState, type: 'transfer' }
          : {
              ...baseFormState,
              ...incomeExpensesFormState,
              type: baseFormState.type as 'income' | 'expenses'
            }

      const updatedState =
        typeof newState === 'function'
          ? newState(currentState as typeof formState)
          : newState

      setBaseFormState(prev => ({
        ...prev,
        type: updatedState.type,
        date: updatedState.date,
        amount: updatedState.amount,
        receipt: updatedState.receipt
      }))

      if (updatedState.type === 'transfer') {
        setTransferFormState(prev => ({
          ...prev,
          from: updatedState.from,
          to: updatedState.to
        }))

        if (baseFormState.type !== 'transfer') {
          setIncomeExpensesFormState({
            category: '',
            asset: '',
            ledgers: [],
            particulars: '',
            location: undefined
          })
        }
      } else {
        setIncomeExpensesFormState(prev => ({
          ...prev,
          type: updatedState.type,
          category: updatedState.category || '',
          asset: updatedState.asset || '',
          ledgers: updatedState.ledgers || [],
          particulars: updatedState.particulars || '',
          location: updatedState.location
        }))

        if (baseFormState.type === 'transfer') {
          setTransferFormState({
            from: '',
            to: ''
          })
        }
      }
    },
    [baseFormState, transferFormState, incomeExpensesFormState]
  )

  useEffect(() => {
    if (initialData && type === 'update') {
      setBaseFormState({
        type: initialData.type ?? 'income',
        date: dayjs(initialData.date).toDate(),
        amount: initialData.amount || 0,
        receipt: {
          image: initialData.receipt || null,
          preview: (() => {
            if ((initialData.receipt as File | string | null) instanceof File) {
              return URL.createObjectURL(initialData.receipt as unknown as File)
            }

            if (initialData.receipt) {
              return `${import.meta.env.VITE_API_HOST}/media/${initialData.collectionId}/${initialData.id}/${initialData.receipt}`
            }

            return null
          })()
        }
      })

      if (initialData.type === 'transfer') {
        setTransferFormState({
          from: initialData.from || '',
          to: initialData.to || ''
        })

        setIncomeExpensesFormState({
          category: '',
          asset: '',
          ledgers: [],
          particulars: '',
          location: undefined
        })
      } else {
        setIncomeExpensesFormState({
          category: initialData.category || '',
          asset: initialData.asset || '',
          ledgers: initialData.ledgers || [],
          particulars: initialData.particulars || '',
          location: {
            name: initialData.location_name || '',
            location: {
              latitude: initialData.location_coords?.lat || 0,
              longitude: initialData.location_coords?.lon || 0
            },
            formattedAddress: initialData.location_name || ''
          }
        })
      }
    } else {
      setBaseFormState({
        type: 'income',
        date: dayjs().toDate(),
        amount: 0,
        receipt: {
          image: null,
          preview: null
        }
      })

      setIncomeExpensesFormState({
        category: '',
        asset: '',
        ledgers: [],
        particulars: '',
        location: undefined
      })

      setTransferFormState({
        from: '',
        to: ''
      })
    }

    setToRemoveReceipt(false)
  }, [initialData, type])

  return (
    <FormModal
      customUpdateDataList={{
        create: () => {
          queryClient.invalidateQueries({
            queryKey: ['wallet']
          })
        },
        update: () => {
          queryClient.invalidateQueries({
            queryKey: ['wallet']
          })
        }
      }}
      data={formState}
      endpoint="wallet/transactions"
      fields={fields as never}
      getFinalData={async () => ({
        ...formState,
        toRemoveReceipt
      })}
      icon={type === 'create' ? 'tabler:plus' : 'tabler:pencil'}
      id={initialData ? initialData.id : ''}
      namespace="apps.wallet"
      openType={type}
      setData={handleChange}
      title={`transactions.${type}`}
      onClose={onClose}
    />
  )
}

export default ModifyTransactionsModal
