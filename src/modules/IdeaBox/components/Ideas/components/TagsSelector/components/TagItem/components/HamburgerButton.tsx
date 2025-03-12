import { Icon } from '@iconify/react'
import clsx from 'clsx'
import React, { useMemo } from 'react'
import tinycolor from 'tinycolor2'

import { useIdeaBoxContext } from '@modules/IdeaBox/providers/IdeaBoxProvider'

import { IIdeaBoxTag } from '../../../../../../../interfaces/ideabox_interfaces'

function HamburgerButton({ tag }: { tag: IIdeaBoxTag }): React.ReactElement {
  const { selectedTags, setExistedTag, setModifyTagModalOpenType } =
    useIdeaBoxContext()

  const hamburgerIconColor = useMemo(() => {
    if (!selectedTags.includes(tag.name)) {
      return 'text-bg-500 hover:bg-bg-600 hover:text-bg-100'
    }

    if (tag.color === '') {
      return 'text-custom-500 hover:bg-custom-500/30 hover:text-custom-500'
    }

    return tinycolor(tag.color).isLight()
      ? 'text-bg-800 hover:bg-bg-800 hover:text-bg-100'
      : 'text-bg-100 hover:bg-bg-100 hover:text-bg-800'
  }, [selectedTags, tag])

  return (
    <button
      className={clsx(
        'hidden aspect-square h-full items-center justify-center rounded-full text-xs transition-all group-hover:flex',
        hamburgerIconColor
      )}
      onClick={e => {
        e.stopPropagation()
        setExistedTag(tag)
        setModifyTagModalOpenType('update')
      }}
    >
      <Icon icon="tabler:dots-vertical" />
    </button>
  )
}

export default HamburgerButton
