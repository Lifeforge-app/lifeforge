import { Icon } from '@iconify/react'
import { ListboxOrComboboxInput, ListboxOrComboboxOption } from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'

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
  transactionType: 'income' | 'expenses' | 'transfer'
  setTransactionType: (type: 'income' | 'expenses' | 'transfer') => void
}) {
  const { t } = useTranslation('apps.wallet')

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
              `transactionTypes.${
                TRANSACTION_TYPES.find(
                  l => l.id === transactionType
                )?.name.toLowerCase() ?? ''
              }`
            ) ?? 'None'}
          </span>
        </>
      }
      icon="tabler:list"
      name="Transaction Type"
      namespace="apps.wallet"
      setValue={setTransactionType}
      type="listbox"
      value={transactionType}
    >
      {TRANSACTION_TYPES.map(({ name, color, id }, i) => (
        <ListboxOrComboboxOption
          key={i}
          color={color}
          text={t(`transactionTypes.${name.toLowerCase()}`)}
          value={id}
        />
      ))}
    </ListboxOrComboboxInput>
  )
}

export default TransactionTypeSelector
