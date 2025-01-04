import { Icon } from '@iconify/react/dist/iconify.js'
import React, { useMemo } from 'react'
import { useIdeaBoxContext } from '@providers/IdeaBoxProvider'
import { isLightColor } from '@utils/colors'

function TagChip({ text }: { text: string }): React.ReactElement {
  const { selectedTags, tags } = useIdeaBoxContext()
  const metadata = useMemo(
    () =>
      typeof tags !== 'string'
        ? tags.find(tag => tag.name === text)
        : undefined,
    [selectedTags, text]
  )
  const active = useMemo(
    () => selectedTags.includes(text),
    [selectedTags, text]
  )
  return (
    <div
      className={`flex items-center rounded-full px-3 py-1 text-sm ${
        active
          ? metadata !== undefined && metadata.color !== ''
            ? isLightColor(metadata.color)
              ? 'text-bg-800'
              : 'text-bg-100'
            : 'bg-custom-500/30 text-custom-500'
          : 'bg-bg-200 text-bg-500 dark:bg-bg-700/50 dark:text-bg-300'
      }`}
      style={{
        backgroundColor: metadata !== undefined && active ? metadata.color : ''
      }}
    >
      {metadata !== undefined && (
        <Icon
          icon={metadata.icon}
          className="mr-2 size-3 shrink-0"
          style={{
            color: !active ? metadata.color : ''
          }}
        />
      )}
      <span className="shrink-0 text-sm">{text}</span>
    </div>
  )
}

export default TagChip