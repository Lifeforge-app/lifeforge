import React from 'react'
import { useTranslation } from 'react-i18next'
import ListboxInput from '@components/ButtonsAndInputs/ListboxInput'
import ListboxOption from '@components/ButtonsAndInputs/ListboxInput/components/ListboxOption'
import { useTodoListContext } from '@providers/TodoListProvider'

function TagsSelector({
  tags,
  setTags
}: {
  tags: string[]
  setTags: (tags: string[]) => void
}): React.ReactElement {
  const { t } = useTranslation()
  const { tags: tagsList } = useTodoListContext()

  if (typeof tagsList === 'string') return <></>

  return (
    <ListboxInput
      name={t('input.tags')}
      icon="tabler:tags"
      value={tags}
      setValue={setTags}
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
    >
      {tagsList.map(({ name, id }, i) => (
        <ListboxOption key={i} icon="tabler:hash" text={name} value={id} />
      ))}
    </ListboxInput>
  )
}

export default TagsSelector
