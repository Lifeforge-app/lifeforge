import { Icon } from '@iconify/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ListboxOrComboboxInput , ListboxOrComboboxOption } from '@components/inputs'

const TRANSACTION_TYPES = [
  { name: 'Income', color: '#10B981', id: 'income', icon: 'tabler:login-2' },
  { name: 'Expenses', color: '#EF4444', id: 'expenses', icon: 'tabler:logout' },
  {
    name: 'Transfer',
    color: '#3B82F6',
    id: 'transfer',
    icon: 'tabler:transfer'
  }
]

function TransactionTypeSelector({
  transactionType,
  setTransactionType
}: {
  transactionType: string
  setTransactionType: (type: 'income' | 'expenses' | 'transfer') => void
}): React.ReactElement {
  const { t } = useTranslation()

  return (
    <ListboxOrComboboxInput
      type="listbox"
      name={t('input.transactionType')}
      icon="tabler:list"
      value={transactionType}
      setValue={setTransactionType}
      buttonContent={
        <>
          <Icon
            icon={
              TRANSACTION_TYPES.find(l => l.id === transactionType)?.icon ?? ''
            }
            style={{
              color: TRANSACTION_TYPES.find(l => l.id === transactionType)
                ?.color
            }}
            className="size-5"
          />
          <span className="-mt-px block truncate">
            {TRANSACTION_TYPES.find(l => l.id === transactionType)?.name ??
              'None'}
          </span>
        </>
      }
    >
      {TRANSACTION_TYPES.map(({ name, color, id }, i) => (
        <ListboxOrComboboxOption key={i} text={name} color={color} value={id} />
      ))}
    </ListboxOrComboboxInput>
  )
}

export default TransactionTypeSelector
