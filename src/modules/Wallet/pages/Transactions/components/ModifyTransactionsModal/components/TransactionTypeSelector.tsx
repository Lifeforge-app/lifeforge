import { Listbox } from '@headlessui/react'
import { Icon } from '@iconify/react'
import React from 'react'
import ListboxTransition from '@components/ListBox/ListboxTransition'

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
  setTransactionType,
  openType
}: {
  transactionType: string
  setTransactionType: React.Dispatch<
    React.SetStateAction<'income' | 'expenses' | 'transfer'>
  >
  openType: 'create' | 'update' | null
}): React.ReactElement {
  return (
    <Listbox
      disabled={openType === 'update'}
      value={transactionType}
      onChange={tt => {
        setTransactionType(tt as 'income' | 'expenses' | 'transfer')
      }}
      as="div"
      className="group relative mb-4 flex items-center gap-1 rounded-t-lg border-b-2 border-bg-500 bg-bg-200/50 shadow-custom focus-within:!border-custom-500 dark:bg-bg-800/50"
    >
      <Listbox.Button className="flex w-full items-center">
        <Icon
          icon="tabler:list"
          className={`ml-6 size-6 shrink-0 ${
            transactionType !== null ? '' : 'text-bg-500'
          } group-focus-within:!text-custom-500`}
        />
        <span
          className={`pointer-events-none absolute left-[4.2rem] font-medium tracking-wide text-bg-500 group-focus-within:!text-custom-500 ${'top-6 -translate-y-1/2 text-[14px]'}`}
        >
          Transaction type {openType === 'update' && '(Unchangable)'}
        </span>
        <div className="relative mb-3 mt-10 flex w-full items-center gap-2 rounded-lg pl-5 pr-10 text-left focus:outline-none">
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
        </div>
        <span className="pointer-events-none absolute inset-y-0 right-0 mt-1 flex items-center pr-4">
          <Icon icon="tabler:chevron-down" className="size-5 text-bg-500" />
        </span>
      </Listbox.Button>
      <ListboxTransition>
        <Listbox.Options className="absolute top-[120%] z-50 mt-1 max-h-56 w-full divide-y divide-bg-200 overflow-auto rounded-md bg-bg-100 py-1 text-base shadow-lg focus:outline-none dark:divide-bg-700 dark:bg-bg-800">
          {TRANSACTION_TYPES.map(({ name, color, id }, i) => (
            <Listbox.Option
              key={i}
              className={({ active }) =>
                `relative cursor-pointer select-none transition-all p-4 flex items-center justify-between ${
                  active ? 'bg-bg-200/50 dark:bg-bg-700/50' : '!bg-transparent'
                }`
              }
              value={id}
            >
              {({ selected }) => (
                <>
                  <div>
                    <span className="flex items-center gap-2">
                      <Icon
                        icon={
                          TRANSACTION_TYPES.find(l => l.id === id)?.icon ?? ''
                        }
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
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </ListboxTransition>
    </Listbox>
  )
}

export default TransactionTypeSelector
