import { Icon } from '@iconify/react'
import { toCamelCase } from '@utils/strings'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { ListboxOrComboboxInput, ListboxOrComboboxOption } from '@lifeforge/ui'

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
  const { t } = useTranslation('modules.wallet')

  return (
    <ListboxOrComboboxInput
      required
      buttonContent={
        <>
          <Icon
            className="size-5"
            icon={
              TRANSACTION_TYPES.find(l => l.id === transactionType)?.icon ?? ''
            }
            style={{
              color: TRANSACTION_TYPES.find(l => l.id === transactionType)
                ?.color
            }}
          />
          <span className="-mt-px block truncate">
            {t(
              `transactionTypes.${toCamelCase(
                TRANSACTION_TYPES.find(l => l.id === transactionType)?.name ??
                  ''
              )}`
            ) ?? 'None'}
          </span>
        </>
      }
      icon="tabler:list"
      name="Transaction Type"
      namespace="modules.wallet"
      setValue={setTransactionType}
      type="listbox"
      value={transactionType}
    >
      {TRANSACTION_TYPES.map(({ name, color, id }, i) => (
        <ListboxOrComboboxOption
          key={i}
          color={color}
          text={t(`transactionTypes.${toCamelCase(name)}`)}
          value={id}
        />
      ))}
    </ListboxOrComboboxInput>
  )
}

export default TransactionTypeSelector
