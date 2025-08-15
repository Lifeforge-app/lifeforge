// PriorityListbox.tsx
import { ListboxInput, ListboxOption } from 'lifeforge-ui'

import { useTodoListContext } from '@apps/TodoList/providers/TodoListProvider'

function PrioritySelector({
  priority,
  setPriority
}: {
  priority: string
  setPriority: React.Dispatch<React.SetStateAction<string>>
}) {
  const { prioritiesQuery } = useTodoListContext()

  const priorities = prioritiesQuery.data ?? []

  return (
    <ListboxInput
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
      label="priority"
      namespace="apps.todoList"
      setValue={setPriority}
      value={priority}
    >
      <ListboxOption key={'none'} color="lightgray" label="None" value="" />
      {priorities.map(({ name, color, id }, i) => (
        <ListboxOption key={i} color={color} label={name} value={id} />
      ))}
    </ListboxInput>
  )
}

export default PrioritySelector
