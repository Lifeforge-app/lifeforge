import { ListboxOrComboboxInput, ListboxOrComboboxOption } from 'lifeforge-ui'

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
    <ListboxOrComboboxInput
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
      type="listbox"
      value={tags}
    >
      {tagsList.map(({ name, id }, i) => (
        <ListboxOrComboboxOption
          key={i}
          icon="tabler:hash"
          text={name}
          value={id}
        />
      ))}
    </ListboxOrComboboxInput>
  )
}

export default TagsSelector
