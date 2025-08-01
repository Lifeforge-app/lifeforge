import { ListboxInput, ListboxOption } from 'lifeforge-ui'

import { useTodoListContext } from '@apps/TodoList/providers/TodoListProvider'

function TagsSelector({
  tags,
  setTags
}: {
  tags: string[]
  setTags: (tags: string[]) => void
}) {
  const { tagsListQuery } = useTodoListContext()

  const tagsList = tagsListQuery.data ?? []

  return (
    <ListboxInput
      multiple
      buttonContent={
        <span className="-mt-px block truncate">
          {tags.length > 0
            ? tags
                .map(tag => `# ${tagsList.find(t => t.id === tag)?.name}`)
                .join(', ')
            : 'None'}
        </span>
      }
      icon="tabler:tags"
      name="tags"
      namespace="apps.todoList"
      setValue={setTags}
      value={tags}
    >
      {tagsList.map(({ name, id }, i) => (
        <ListboxOption key={i} icon="tabler:hash" text={name} value={id} />
      ))}
    </ListboxInput>
  )
}

export default TagsSelector
