import { Icon } from '@iconify/react'
import clsx from 'clsx'
import { memo, useMemo } from 'react'
import tinycolor from 'tinycolor2'

function HamburgerButton({
  tagColor,
  isSelected,
  onUpdate
}: {
  tagColor: string
  isSelected: boolean
  onUpdate: () => void
}) {
  const hamburgerIconColor = useMemo(() => {
    if (!isSelected) {
      return 'text-bg-500 hover:bg-bg-600 hover:text-bg-100'
    }

    if (tagColor === '') {
      return 'text-custom-500 hover:bg-custom-500/30 hover:text-custom-500'
    }

    return tinycolor(tagColor).isLight()
      ? 'text-bg-800 hover:bg-bg-800 hover:text-bg-100'
      : 'text-bg-100 hover:bg-bg-100 hover:text-bg-800'
  }, [isSelected, tagColor])

  return (
    <button
      className={clsx(
        'hidden aspect-square h-full items-center justify-center rounded-full text-xs transition-all group-hover:flex',
        hamburgerIconColor
      )}
      onClick={onUpdate}
    >
      <Icon icon="tabler:dots-vertical" />
    </button>
  )
}

export default memo(HamburgerButton, (prevProps, nextProps) => {
  return (
    prevProps.tagColor === nextProps.tagColor &&
    prevProps.isSelected === nextProps.isSelected
  )
})
