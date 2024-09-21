import { ListboxOption } from '@headlessui/react'
import { Icon } from '@iconify/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import ListboxInput from '@components/ButtonsAndInputs/ListboxInput'

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
    <ListboxInput
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
        <ListboxOption
          key={i}
          className={({ active }) =>
            `relative cursor-pointer select-none transition-all p-4 flex flex-between ${
              active
                ? 'hover:bg-bg-100 dark:hover:bg-bg-700/50'
                : '!bg-transparent'
            }`
          }
          value={id}
        >
          {({ selected }) => (
            <>
              <div>
                <span className="flex items-center gap-2">
                  <Icon
                    icon={TRANSACTION_TYPES.find(l => l.id === id)?.icon ?? ''}
                    style={{ color }}
                    className="size-5"
                  />
                  {name}
                </span>
              </div>
              {selected && (
                <Icon
                  icon="tabler:check"
                  className="block text-lg text-custom-500"
                />
              )}
            </>
          )}
        </ListboxOption>
      ))}
    </ListboxInput>
  )
}

export default TransactionTypeSelector
