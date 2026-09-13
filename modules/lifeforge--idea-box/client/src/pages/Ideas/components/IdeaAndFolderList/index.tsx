import { useCallback } from 'react'

import { useModuleTranslation } from '@lifeforge/localization'
import { EmptyStateScreen, WithQuery, useModalStore } from '@lifeforge/ui'

import { useIdeaBoxContext } from '@/providers/IdeaBoxProvider'

import ModifyIdeaModal from '../modals/ModifyIdeaModal'
import FolderList from './components/FolderList'
import IdeaList from './components/IdeaList'

function IdeaAndFolderList() {
  const { open } = useModalStore()
  const { t } = useModuleTranslation()

  const {
    entriesQuery,
    foldersQuery,
    searchResultsQuery,
    searchQuery,
    selectedTags,
    viewArchived
  } = useIdeaBoxContext()

  const handleIdeaCreation = useCallback(() => {
    open(ModifyIdeaModal, {
      type: 'create',
      initialData: {
        type: 'text'
      }
    })
  }, [])

  return (
    <div className="mt-6 mb-20">
      {searchQuery.trim().length === 0 && selectedTags.length === 0 ? (
        <WithQuery query={entriesQuery}>
          {data => (
            <WithQuery query={foldersQuery}>
              {folders => (
                <>
                  {data.length === 0 && folders.length === 0 ? (
                    <div className="mt-6">
                      {!viewArchived ? (
                        <EmptyStateScreen
                          CTAButtonProps={{
                            children: 'new',
                            onClick: handleIdeaCreation,
                            icon: 'tabler:plus',
                            tProps: {
                              item: t('items.idea')
                            }
                          }}
                          icon="tabler:bulb-off"
                          message={{
                            id: 'idea'
                          }}
                        />
                      ) : (
                        <EmptyStateScreen
                          icon="tabler:archive-off"
                          message={{
                            id: 'archived'
                          }}
                        />
                      )}
                    </div>
                  ) : (
                    <>
                      {folders.length > 0 && !viewArchived && <FolderList />}
                      {data.length > 0 && <IdeaList data={data} />}
                    </>
                  )}
                </>
              )}
            </WithQuery>
          )}
        </WithQuery>
      ) : (
        <WithQuery query={searchResultsQuery}>
          {searchResults => (
            <>
              {searchResults.length === 0 ? (
                <div className="mt-6">
                  <EmptyStateScreen
                    icon="tabler:search"
                    message={{
                      id: 'result'
                    }}
                  />
                </div>
              ) : (
                <IdeaList data={searchResults} />
              )}
            </>
          )}
        </WithQuery>
      )}
    </div>
  )
}

export default IdeaAndFolderList
