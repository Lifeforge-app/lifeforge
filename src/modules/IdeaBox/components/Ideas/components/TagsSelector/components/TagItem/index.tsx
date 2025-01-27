import { Icon } from '@iconify/react/dist/iconify.js'
import React, { useMemo } from 'react'
import { IIdeaBoxTag } from '@interfaces/ideabox_interfaces'
import { useIdeaBoxContext } from '@providers/IdeaBoxProvider'
import { isLightColor } from '@utils/colors'
import HamburgerButton from './components/HamburgerButton'
import ItemCount from './components/ItemCount'

function TagItem({
  tag,
  countHashMap,
  onSelect
}: {
  tag: IIdeaBoxTag
  countHashMap: Map<string, number>
  onSelect: (tagName: string) => void
}): React.ReactElement {
  const { selectedTags } = useIdeaBoxContext()

  const tagColor = useMemo(() => {
    if (!selectedTags.includes(tag.name)) {
      return 'bg-bg-200 text-bg-500 dark:bg-bg-700/50 dark:text-bg-300'
    }

    if (tag.color === '') {
      return 'bg-custom-500/30 text-custom-500'
    }

    return isLightColor(tag.color) ? 'text-bg-800' : 'text-bg-100'
  }, [selectedTags, tag])

  return (
    <div
      role="button"
      tabIndex={0}
      key={tag.id}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect(tag.name)
        }
      }}
      onClick={() => {
        onSelect(tag.name)
      }}
      className={`group inline-flex cursor-pointer items-center gap-2 rounded-full px-3 py-1 transition-all ${tagColor}`}
      style={{
        backgroundColor: selectedTags.includes(tag.name) ? tag.color : ''
      }}
    >
      {tag.icon !== '' && (
        <Icon
          icon={tag.icon}
          className="size-3 shrink-0"
          style={{
            color: !selectedTags.includes(tag.name) ? tag.color : ''
          }}
        />
      )}
      <span className="shrink-0 text-sm">{tag.name}</span>
      <ItemCount tag={tag} count={countHashMap.get(tag.name) ?? 0} />
      <HamburgerButton tag={tag} />
    </div>
  )
}

export default TagItem
