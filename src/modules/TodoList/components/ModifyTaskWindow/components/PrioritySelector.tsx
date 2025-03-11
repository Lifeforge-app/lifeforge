// PriorityListbox.tsx
import { useTodoListContext } from '@providers/TodoListProvider'
import React from 'react'

import { ListboxOrComboboxInput, ListboxOrComboboxOption } from '@lifeforge/ui'

function PrioritySelector({
  priority,
  setPriority
}: {
  priority: string | null
  setPriority: React.Dispatch<React.SetStateAction<string | null>>
}): React.ReactElement {
  const { priorities } = useTodoListContext()

  if (typeof priorities === 'string') return <></>

  return (
    <ListboxOrComboboxInput
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
      icon="tabler:alert-triangle"
      name="priority"
      namespace="modules.todoList"
      setValue={setPriority}
      type="listbox"
      value={priority}
    >
      <ListboxOrComboboxOption
        key={'none'}
        color="lightgray"
        text="None"
        value=""
      />
      {priorities.map(({ name, color, id }, i) => (
        <ListboxOrComboboxOption key={i} color={color} text={name} value={id} />
      ))}
    </ListboxOrComboboxInput>
  )
}

export default PrioritySelector
