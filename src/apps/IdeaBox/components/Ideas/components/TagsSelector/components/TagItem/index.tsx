import { useIdeaBoxContext } from '@apps/IdeaBox/providers/IdeaBoxProvider'
import { Icon } from '@iconify/react'
import clsx from 'clsx'
import { useMemo } from 'react'
import tinycolor from 'tinycolor2'

import { IIdeaBoxTag } from '../../../../../../interfaces/ideabox_interfaces'
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
}) {
  const { selectedTags } = useIdeaBoxContext()

  const tagColor = useMemo(() => {
    if (!selectedTags.includes(tag.name)) {
      return 'bg-bg-200 text-bg-500 dark:bg-bg-700/50 dark:text-bg-300'
    }

    if (tag.color === '') {
      return 'bg-custom-500/30 text-custom-500'
    }

    return tinycolor(tag.color).isLight() ? 'text-bg-800' : 'text-bg-100'
  }, [selectedTags, tag])

  return (
    <div
      key={tag.id}
      className={clsx(
        'group inline-flex cursor-pointer items-center gap-2 rounded-full px-3 py-1 transition-all',
        tagColor
      )}
      role="button"
      style={{
        backgroundColor: selectedTags.includes(tag.name) ? tag.color : ''
      }}
      tabIndex={0}
      onClick={() => {
        onSelect(tag.name)
      }}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect(tag.name)
        }
      }}
    >
      {tag.icon !== '' && (
        <Icon
          className="size-3 shrink-0"
          icon={tag.icon}
          style={{
            color: !selectedTags.includes(tag.name) ? tag.color : ''
          }}
        />
      )}
      <span className="shrink-0 text-sm">{tag.name}</span>
      <ItemCount count={countHashMap.get(tag.name) ?? 0} tag={tag} />
      <HamburgerButton tag={tag} />
    </div>
  )
}

export default TagItem
