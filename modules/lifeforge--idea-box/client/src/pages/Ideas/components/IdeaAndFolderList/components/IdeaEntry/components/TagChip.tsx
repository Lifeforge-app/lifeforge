import { memo, useMemo } from 'react'

import { TagChip as _TagChip } from '@lifeforge/ui'

import { useIdeaBoxContext } from '@/providers/IdeaBoxProvider'

function TagChip({ text }: { text: string }) {
  const { selectedTags, tagsQuery } = useIdeaBoxContext()

  const tags = tagsQuery.data ?? []

  const metadata = useMemo(
    () =>
      typeof tags !== 'string'
        ? tags.find(tag => tag.name === text)
        : undefined,
    [selectedTags, text, tags]
  )

  return <_TagChip color={metadata?.color} icon={metadata?.icon} label={text} />
}

export default memo(TagChip, (prevProps, nextProps) => {
  return prevProps.text === nextProps.text
})
