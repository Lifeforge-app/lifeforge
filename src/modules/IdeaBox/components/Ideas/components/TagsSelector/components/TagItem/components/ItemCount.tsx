import clsx from 'clsx'
import React, { useMemo } from 'react'
import { useParams } from 'react-router'
import tinycolor from 'tinycolor2'

import { useIdeaBoxContext } from '@modules/IdeaBox/providers/IdeaBoxProvider'

import { IIdeaBoxTag } from '../../../../../../../interfaces/ideabox_interfaces'

function ItemCount({
  tag,
  count
}: {
  tag: IIdeaBoxTag
  count: number
}): React.ReactElement {
  const { '*': path } = useParams<{ '*': string }>()
  const { debouncedSearchQuery, selectedTags } = useIdeaBoxContext()

  const tagCountColor = useMemo(() => {
    if (!selectedTags.includes(tag.name)) {
      return 'text-bg-500'
    }

    if (tag.color === '') {
      return 'bg-custom-500/30 text-custom-500'
    }

    return tinycolor(tag.color).isLight() ? 'text-bg-800' : 'text-bg-100'
  }, [selectedTags, tag])

  return (
    <span
      className={clsx('ml-[5px] text-xs group-hover:hidden', tagCountColor)}
    >
      {path === '' && debouncedSearchQuery.trim().length === 0
        ? tag.count
        : count}
    </span>
  )
}

export default ItemCount
