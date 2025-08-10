import forgeAPI from '@utils/forgeAPI'
import { SearchInput, ViewModeSelector } from 'lifeforge-ui'
import { useState } from 'react'
import { toast } from 'react-toastify'

import type { ScoreLibrarySortType } from '..'
import SortBySelector from './SortBySelector'

function Searchbar({
  view,
  setView,
  searchQuery,
  setSearchQuery,
  sortType,
  setSortType
}: {
  view: 'grid' | 'list'
  setView: React.Dispatch<React.SetStateAction<'grid' | 'list'>>
  searchQuery: string
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>
  sortType: ScoreLibrarySortType
  setSortType: React.Dispatch<React.SetStateAction<ScoreLibrarySortType>>
}) {
  const [requestRandomLoading, setRequestRandomLoading] = useState(false)

  async function requestRandomEntry() {
    setRequestRandomLoading(true)

    try {
      const entry = await forgeAPI.scoresLibrary.entries.random.query()

      const url = forgeAPI.media.input({
        collectionId: entry.collectionId,
        recordId: entry.id,
        fieldId: entry.pdf
      }).endpoint

      window.open(url, '_blank')
      setRequestRandomLoading(false)
    } catch {
      toast.error('Failed to fetch random entry')
    } finally {
      setRequestRandomLoading(false)
    }
  }

  return (
    <div className="mt-4 flex gap-2">
      <SortBySelector setSortType={setSortType} sortType={sortType} />
      <SearchInput
        className="bg-bg-50"
        namespace="apps.scoresLibrary"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sideButtonIcon="tabler:dice"
        sideButtonLoading={requestRandomLoading}
        stuffToSearch="score"
        onSideButtonClick={requestRandomEntry}
      />
      <ViewModeSelector
        className="bg-bg-50 hidden md:flex"
        options={[
          { value: 'list', icon: 'uil:list-ul' },
          { value: 'grid', icon: 'uil:apps' }
        ]}
        setViewMode={setView}
        viewMode={view}
      />
    </div>
  )
}

export default Searchbar
