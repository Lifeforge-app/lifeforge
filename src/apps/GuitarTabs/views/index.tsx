import { EmptyStateScreen } from '@lifeforge/ui'

import { IGuitarTabsEntry } from '../interfaces/guitar_tabs_interfaces'
import GridView from './GridView'
import ListView from './ListView'

function Views({
  entries,
  queryKey,
  setDeleteConfirmationModalOpen,
  setExistingEntry,
  setModifyEntryModalOpen,
  view,
  debouncedSearchQuery,
  totalItems
}: {
  entries: IGuitarTabsEntry[]
  queryKey: unknown[]
  setDeleteConfirmationModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  setExistingEntry: React.Dispatch<React.SetStateAction<any>>
  setModifyEntryModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  view: 'grid' | 'list'
  debouncedSearchQuery: string
  totalItems: number
}) {
  if (totalItems === 0) {
    if (debouncedSearchQuery.trim() === '') {
      return (
        <EmptyStateScreen
          icon="tabler:music-off"
          name="score"
          namespace="apps.guitarTabs"
        />
      )
    }

    return (
      <EmptyStateScreen
        icon="tabler:search-off"
        name="result"
        namespace="apps.guitarTabs"
      />
    )
  }

  switch (view) {
    case 'grid':
      return (
        <GridView
          entries={entries}
          queryKey={queryKey}
          setDeleteConfirmationModalOpen={setDeleteConfirmationModalOpen}
          setExistingEntry={setExistingEntry}
          setModifyEntryModalOpen={setModifyEntryModalOpen}
        />
      )
    case 'list':
      return (
        <ListView
          entries={entries}
          setDeleteConfirmationModalOpen={setDeleteConfirmationModalOpen}
          setExistingEntry={setExistingEntry}
          setModifyEntryModalOpen={setModifyEntryModalOpen}
        />
      )
  }
}

export default Views
