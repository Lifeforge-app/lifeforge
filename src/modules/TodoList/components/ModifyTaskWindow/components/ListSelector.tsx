import { Listbox } from '@headlessui/react'
import { Icon } from '@iconify/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import ListboxInput from '@components/ButtonsAndInputs/ListboxInput'
import { useTodoListContext } from '@providers/TodoListProvider'

function ListSelector({
  list,
  setList
}: {
  list: string | null
  setList: (list: string) => void
}): React.ReactElement {
  const { t } = useTranslation()
  const { lists } = useTodoListContext()

  if (typeof lists === 'string') return <></>

  return (
    <ListboxInput
      name={t('input.lists')}
      icon="tabler:list"
      value={list}
      setValue={setList}
      buttonContent={
        <>
          <span
            className="size-3 rounded-full border border-bg-300"
            style={{
              backgroundColor: lists.find(l => l.id === list)?.color
            }}
          />
          <span className="-mt-px block truncate">
            {lists.find(l => l.id === list)?.name ?? 'None'}
          </span>
        </>
      }
    >
      <Listbox.Option
        key={'none'}
        className={({ active }) =>
          `relative cursor-pointer select-none transition-all p-4 flex flex-between ${
            active ? 'bg-bg-200/50 dark:bg-bg-700/50' : '!bg-transparent'
          }`
        }
        value={null}
      >
        {({ selected }) => (
          <>
            <div>
              <span className="flex items-center gap-2">
                <span className="size-3 rounded-full border border-bg-300" />
                None
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
      {lists.map(({ name, color, id }, i) => (
        <Listbox.Option
          key={i}
          className={({ active }) =>
            `relative cursor-pointer select-none transition-all p-4 flex flex-between ${
              active ? 'bg-bg-200/50 dark:bg-bg-700/50' : '!bg-transparent'
            }`
          }
          value={id}
        >
          {({ selected }) => (
            <>
              <div>
                <span className="flex items-center gap-2">
                  <span
                    className="size-3 rounded-full border border-bg-300"
                    style={{
                      backgroundColor: color
                    }}
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
    </ListboxInput>
  )
}

export default ListSelector
