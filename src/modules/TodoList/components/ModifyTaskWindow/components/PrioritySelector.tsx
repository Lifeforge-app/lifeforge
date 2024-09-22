// PriorityListbox.tsx
import React from 'react'
import { useTranslation } from 'react-i18next'
import ListboxInput from '@components/ButtonsAndInputs/ListboxInput'
import ListboxOption from '@components/ButtonsAndInputs/ListboxInput/components/ListboxOption'
import { useTodoListContext } from '@providers/TodoListProvider'

function PrioritySelector({
  priority,
  setPriority
}: {
  priority: string | null
  setPriority: React.Dispatch<React.SetStateAction<string | null>>
}): React.ReactElement {
  const { t } = useTranslation()
  const { priorities } = useTodoListContext()

  if (typeof priorities === 'string') return <></>

  return (
    <ListboxInput
      name={t('input.priority')}
      icon="tabler:alert-triangle"
      value={priority}
      setValue={setPriority}
      buttonContent={
        <>
          <span
            className="block h-6 w-1 rounded-full"
            style={{
              backgroundColor:
                priorities.find(p => p.id === priority)?.color ?? 'lightgray'
            }}
          />
          <span className="-mt-px block truncate">
            {priorities.find(p => p.id === priority)?.name ?? 'None'}
          </span>
        </>
      }
    >
      <ListboxOption key={'none'} value="" text="None" color="lightgray" />
      {priorities.map(({ name, color, id }, i) => (
        <ListboxOption key={i} value={id} text={name} color={color} />
      ))}
    </ListboxInput>
  )
}

export default PrioritySelector
