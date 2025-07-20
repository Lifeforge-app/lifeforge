import { Icon } from '@iconify/react/dist/iconify.js'
import _ from 'lodash'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ModalHeader, SearchInput } from '@lifeforge/ui'

import { oklchToHex } from '../../../../utils/colors'
import NODE_CONFIG, { NODES_CATEGORIES, type NODE_TYPES } from '../../nodes'

function NodeSelector({
  onClose,
  data: { onSelect }
}: {
  onClose: () => void
  data: {
    onSelect: (nodeType: NODE_TYPES) => void
  }
}) {
  const { t } = useTranslation('core.apiBuilder')
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="min-w-[300px]">
      <ModalHeader
        namespace="core.apiBuilder"
        title="New Node"
        icon="tabler:plus"
        onClose={onClose}
      />
      <SearchInput
        namespace="core.apiBuilder"
        stuffToSearch="node"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        lighter
      />
      {NODES_CATEGORIES.map(category => (
        <div key={category.name} className="mt-6">
          <h3 className="mb-2 text-lg font-semibold">
            {t([`nodeCategories.${_.camelCase(category.name)}`, category.name])}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {category.nodes
              .filter(key => {
                const config = NODE_CONFIG[key]
                return (
                  config.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                  t([`nodes.${_.camelCase(config.name)}`, config.name])
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
                )
              })
              .map(key => {
                const config = NODE_CONFIG[key]
                return (
                  <div
                    key={key}
                    className="text-bg-500 component-bg-with-hover hover:text-bg-900 dark:hover:text-bg-100 flex cursor-pointer items-center gap-2 rounded p-3"
                    onClick={() => {
                      onSelect(key)
                      onClose()
                    }}
                  >
                    <div
                      className="flex-center size-8 shrink-0 rounded-md"
                      style={{
                        backgroundColor: oklchToHex(config.color) + '20'
                      }}
                    >
                      <Icon
                        icon={config.icon || 'tabler:circle'}
                        className="size-5"
                        style={{
                          color: config.color || '#000'
                        }}
                      />
                    </div>
                    <span className="truncate">
                      {t([`nodes.${_.camelCase(config.name)}`, config.name])}
                    </span>
                  </div>
                )
              })}
          </div>
        </div>
      ))}
    </div>
  )
}

export default NodeSelector
