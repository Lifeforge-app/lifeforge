import { Icon } from '@iconify/react/dist/iconify.js'
import { useQuery } from '@tanstack/react-query'
import { ModalHeader, QueryWrapper } from 'lifeforge-ui'

import forgeAPI from '../../../../../utils/forgeAPI'
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
  const collectionsQuery = useQuery(
    forgeAPI.database.collections.list.queryOptions()
  )

  return (
    <div className="min-w-[40vw]">
      <ModalHeader
        icon="tabler:folder"
        namespace="core.apiBuilder"
        title="Select Collection"
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
                <button
                  key={collection.name}
                  className="flex-between component-bg-with-hover hover:text-bg-800 dark:hover:text-bg-100 cursor-pointer rounded p-3"
                  onClick={() => {
                    onSelect({
                      ...collection,
                      fields: [
                        {
                          name: 'id',
                          type: 'text',
                          optional: false,
                          options: []
                        },
                        ...collection.fields
                      ]
                    })
                    onClose()
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Icon
                      className="text-bg-500 size-5"
                      icon={
                        collection.type === 'base'
                          ? 'tabler:folder'
                          : 'tabler:columns-3'
                      }
                    />
                    <span className="text-bg-600 dark:text-bg-400">
                      {collection.name}
                    </span>
                  </div>
                  <span className="text-bg-500">
                    {collection.fields.length} fields
                  </span>
                </button>
              ))}
          </div>
        )}
      </QueryWrapper>
    </div>
  )
}

export default CollectionSelector
