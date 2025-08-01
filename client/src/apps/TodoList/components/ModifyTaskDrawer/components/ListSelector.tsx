import { ListboxInput, ListboxOption } from 'lifeforge-ui'

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
    <ListboxInput
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
      value={list ?? ''}
    >
      <ListboxOption color="lightgray" text="None" value="" />
      {lists.map(({ name, color, id }) => (
        <ListboxOption key={id} color={color} text={name} value={id} />
      ))}
    </ListboxInput>
  )
}

export default ListSelector
