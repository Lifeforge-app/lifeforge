import { Icon } from '@iconify/react'
import clsx from 'clsx'
import { memo, useCallback, useMemo } from 'react'
import tinycolor from 'tinycolor2'

import HamburgerButton from './components/HamburgerButton'
import ItemCount from './components/ItemCount'

function TagItem({
  id,
  name,
  icon,
  color,
  count,
  isSelected,
  onSelect,
  onUpdate
}: {
  id: string
  name: string
  icon: string
  color: string
  count: number
  isSelected: boolean
  onSelect: (tagName: string) => void
  onUpdate: (id: string) => void
}) {
  const tagColor = useMemo(() => {
    if (!isSelected) {
      return 'bg-bg-200 text-bg-500 dark:bg-bg-700/50 dark:text-bg-300'
    }

    if (color === '') {
      return 'bg-custom-500/30 text-custom-500'
    }

    return tinycolor(color).isLight() ? 'text-bg-800' : 'text-bg-100'
  }, [isSelected, color])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        onSelect(name)
      }
    },
    [name]
  )

  const handleClick = useCallback(() => {
    onSelect(name)
  }, [name])

  const handleUpdate = useCallback(() => {
    onUpdate(id)
  }, [id])

  return (
    <div
      className={clsx(
        'group inline-flex cursor-pointer items-center gap-2 rounded-full px-3 py-1 transition-all',
        tagColor
      )}
      role="button"
      style={{
        backgroundColor: isSelected ? color : ''
      }}
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {icon !== '' && (
        <Icon
          className="size-3 shrink-0"
          icon={icon}
          style={{
            color: !isSelected ? color : ''
          }}
        />
      )}
      <span className="shrink-0 text-sm">{name}</span>
      <ItemCount isSelected={isSelected} tagColor={color} tagCount={count} />
      <HamburgerButton
        isSelected={isSelected}
        tagColor={color}
        onUpdate={handleUpdate}
      />
    </div>
  )
}

export default memo(TagItem, (prevProps, nextProps) => {
  return (
    prevProps.id === nextProps.id &&
    prevProps.isSelected === nextProps.isSelected
  )
})
