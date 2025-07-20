import dayjs from 'dayjs'
import { FormModal, IFieldProps } from 'lifeforge-ui'
import { SetStateAction, useCallback, useMemo, useState } from 'react'

import {
  LocationsCustomSchemas,
  WalletCollectionsSchemas
} from 'shared/types/collections'

import { useWalletData } from '@apps/Wallet/hooks/useWalletData'

import { IWalletTransaction } from '../..'

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
  const { assetsQuery, categoriesQuery, ledgersQuery } = useWalletData()

  const assets = assetsQuery.data ?? []

  const categories = categoriesQuery.data ?? []

  const ledgers = ledgersQuery.data ?? []

  const [toRemoveReceipt, setToRemoveReceipt] = useState<boolean>(false)

  const [baseFormState, setBaseFormState] = useState<{
    type: IWalletTransaction['type']
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
      'location_name' | 'location_coords' | 'base_transaction'
    > & {
      location: LocationsCustomSchemas.ILocation | undefined
    }
  >({
    type: 'income',
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
          options: categories.map(category => ({
            text: category.name,
            value: category.id,
            icon: category.icon
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
            icon: ledger.icon
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
      ...incomeExpensesFormState
    }
  }, [baseFormState, transferFormState, incomeExpensesFormState])

  const handleChange = useCallback(
    (newState: SetStateAction<typeof formState>) => {
      const currentState =
        baseFormState.type === 'transfer'
          ? { ...baseFormState, ...transferFormState }
          : { ...baseFormState, ...incomeExpensesFormState }

      const updatedState =
        typeof newState === 'function'
          ? newState(currentState as typeof formState)
          : newState

      setBaseFormState(prev => ({
        ...prev,
        type: updatedState.type,
        date: updatedState.date,
        amount: updatedState.amount
      }))

      if (updatedState.type === 'transfer') {
        setTransferFormState(prev => ({
          ...prev,
          from: updatedState.from,
          to: updatedState.to
        }))

        if (baseFormState.type !== 'transfer') {
          setIncomeExpensesFormState({
            type: 'income',
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

  return (
    <FormModal
      data={formState}
      endpoint="wallet/transactions"
      fields={fields as never}
      icon={type === 'create' ? 'tabler:plus' : 'tabler:pencil'}
      id={existedData ? existedData.id : ''}
      namespace="apps.wallet"
      openType={type}
      queryKey={['wallet', 'transactions']}
      setData={handleChange}
      title={`transactions.${type}`}
      onClose={onClose}
    />
  )
}

export default ModifyTransactionsModal
