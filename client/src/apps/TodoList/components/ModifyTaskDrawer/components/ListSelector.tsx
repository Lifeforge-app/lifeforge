import { ListboxOrComboboxInput, ListboxOrComboboxOption } from 'lifeforge-ui'

import { useTodoListContext } from '@apps/TodoList/providers/TodoListProvider'

function ListSelector({
  list,
  setList
}: {
  list: string
  setList: (list: string) => void
}) {
  const { listsQuery } = useTodoListContext()

  const lists = listsQuery.data ?? []

  return (
    <ListboxOrComboboxInput
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
      icon="tabler:list"
      name="list"
      namespace="apps.todoList"
      setValue={setList}
      type="listbox"
      value={list ?? ''}
    >
      <ListboxOrComboboxOption color="lightgray" text="None" value="" />
      {lists.map(({ name, color, id }) => (
        <ListboxOrComboboxOption
          key={id}
          color={color}
          text={name}
          value={id}
        />
      ))}
    </ListboxOrComboboxInput>
  )
}

export default ListSelector
