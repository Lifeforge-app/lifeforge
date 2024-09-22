import React from 'react'
import { useTranslation } from 'react-i18next'
import ListboxInput from '@components/ButtonsAndInputs/ListboxInput'
import ListboxOption from '@components/ButtonsAndInputs/ListboxInput/components/ListboxOption'
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
            className="block h-6 w-1 rounded-full"
            style={{
              backgroundColor:
                lists.find(l => l.id === list)?.color ?? 'lightgray'
            }}
          />
          <span className="-mt-px block truncate">
            {lists.find(l => l.id === list)?.name ?? 'None'}
          </span>
        </>
      }
    >
      <ListboxOption text="None" value="" color="lightgray" />
      {lists.map(({ name, color, id }) => (
        <ListboxOption key={id} text={name} value={id} color={color} />
      ))}
    </ListboxInput>
  )
}

export default ListSelector
