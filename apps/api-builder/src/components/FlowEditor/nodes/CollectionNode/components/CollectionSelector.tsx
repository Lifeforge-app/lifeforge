import { Icon } from '@iconify/react/dist/iconify.js'

import { ModalHeader, QueryWrapper } from '@lifeforge/ui'

import useAPIQuery from '../../../../../hooks/useAPIQuery'
import type { ICollectionNodeData } from '../types'

function CollectionSelector({
  onClose,
  data: { onSelect }
}: {
  onClose: () => void
  data: {
    onSelect: (collection: ICollectionNodeData) => void
  }
}) {
  const collectionsQuery = useAPIQuery<ICollectionNodeData[]>(
    '/database/collections',
    ['database', 'collections']
  )

  return (
    <div className="min-w-[40vw]">
      <ModalHeader
        namespace="core.apiBuilder"
        title="Select Collection"
        icon="tabler:folder"
        onClose={onClose}
      />
      <QueryWrapper query={collectionsQuery}>
        {data => (
          <div className="space-y-2">
            {data
              .sort((a, b) => {
                if (a.type === 'base' && b.type === 'view') return -1
                if (a.type === 'view' && b.type === 'base') return 1
                return a.name.localeCompare(b.name)
              })
              .map(collection => (
                <div
                  key={collection.name}
                  className="flex-between component-bg-with-hover hover:text-bg-900 dark:hover:text-bg-100 cursor-pointer rounded p-3"
                  onClick={() => {
                    onSelect({
                      ...collection,
                      fields: [
                        {
                          name: 'id',
                          type: 'text',
                          optional: false,
                          values: []
                        },
                        ...collection.fields
                      ]
                    })
                    onClose()
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Icon
                      icon={
                        collection.type === 'base'
                          ? 'tabler:folder'
                          : 'tabler:columns-3'
                      }
                      className="text-bg-500 size-5"
                    />
                    <span className="text-bg-600 dark:text-bg-400">
                      {collection.name}
                    </span>
                  </div>
                  <span className="text-bg-500">
                    {collection.fields.length} fields
                  </span>
                </div>
              ))}
          </div>
        )}
      </QueryWrapper>
    </div>
  )
}

export default CollectionSelector
