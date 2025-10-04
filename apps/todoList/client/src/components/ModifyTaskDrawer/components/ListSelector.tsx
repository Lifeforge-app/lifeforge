import { useTodoListContext } from '@/providers/TodoListProvider'
import { ListboxInput, ListboxOption } from 'lifeforge-ui'

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
      label="list"
      namespace="apps.todoList"
      setValue={setList}
      value={list ?? ''}
    >
      <ListboxOption color="lightgray" label="None" value="" />
      {lists.map(({ name, color, id }) => (
        <ListboxOption key={id} color={color} label={name} value={id} />
      ))}
    </ListboxInput>
  )
}

export default ListSelector
