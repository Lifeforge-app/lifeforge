import clsx from 'clsx'
import { memo, useMemo } from 'react'
import tinycolor from 'tinycolor2'

function ItemCount({
  tagColor,
  tagCount,
  isSelected
}: {
  tagColor: string
  tagCount: number
  isSelected: boolean
}) {
  const tagCountColor = useMemo(() => {
    if (!isSelected) {
      return 'text-bg-500'
    }

    if (tagColor === '') {
      return 'bg-custom-500/30 text-custom-500'
    }

    return tinycolor(tagColor).isLight() ? 'text-bg-800' : 'text-bg-100'
  }, [isSelected, tagColor])

  return (
    <span
      className={clsx('ml-[5px] text-xs group-hover:hidden', tagCountColor)}
    >
      {tagCount}
    </span>
  )
}

export default memo(ItemCount, (prevProps, nextProps) => {
  return (
    prevProps.tagColor === nextProps.tagColor &&
    prevProps.tagCount === nextProps.tagCount &&
    prevProps.isSelected === nextProps.isSelected
  )
})
