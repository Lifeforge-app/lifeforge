// PriorityListbox.tsx
import { ListboxOrComboboxInput, ListboxOrComboboxOption } from '@lifeforge/ui'

import { useTodoListContext } from '@apps/TodoList/providers/TodoListProvider'

function PrioritySelector({
  priority,
  setPriority
}: {
  priority: string | null
  setPriority: React.Dispatch<React.SetStateAction<string | null>>
}) {
  const { prioritiesQuery } = useTodoListContext()

  const priorities = prioritiesQuery.data ?? []

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
      namespace="apps.todoList"
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
