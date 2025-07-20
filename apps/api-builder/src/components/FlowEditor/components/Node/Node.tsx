import { Icon } from '@iconify/react/dist/iconify.js'
import clsx from 'clsx'
import _ from 'lodash'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { oklchToHex } from '../../../../utils/colors'
import NODE_CONFIG, { type NODE_TYPES } from '../../nodes'

function Node({
  nodeType,
  selected,
  children
}: {
  nodeType: NODE_TYPES
  selected?: boolean
  children?: React.ReactNode
}) {
  const { t } = useTranslation('core.apiBuilder')

  return (
    <div
      className={clsx(
        'component-bg shadow-custom w-[260px] rounded-xl border p-3 transition-colors',
        !selected ? 'border-bg-200 dark:border-bg-800' : ''
      )}
      style={{
        borderColor: selected ? oklchToHex(NODE_CONFIG[nodeType].color) : ''
      }}
    >
      <header className="flex items-center justify-between">
        <div
          className="flex w-full min-w-0 items-center gap-2 font-semibold"
          title={NODE_CONFIG[nodeType].name}
        >
          <div
            className="flex-center size-7 rounded-md"
            style={{
              backgroundColor: oklchToHex(NODE_CONFIG[nodeType].color) + '20'
            }}
          >
            <Icon
              icon={NODE_CONFIG[nodeType].icon || 'tabler:circle'}
              className="size-5 shrink-0"
              style={{
                color: NODE_CONFIG[nodeType].color || '#000'
              }}
            />
          </div>
          <span className="truncate">
            {t([
              `nodes.${_.camelCase(NODE_CONFIG[nodeType].name)}`,
              NODE_CONFIG[nodeType].name
            ])}
          </span>
        </div>
      </header>
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  )
}

export default Node
