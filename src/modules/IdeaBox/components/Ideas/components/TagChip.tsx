import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'
import { type IIdeaBoxTag } from '@interfaces/ideabox_interfaces'
import { isLightColor } from '@utils/colors'

function TagChip({
  text,
  active,
  metadata
}: {
  text: string
  active: boolean
  metadata?: IIdeaBoxTag
}): React.ReactElement {
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
