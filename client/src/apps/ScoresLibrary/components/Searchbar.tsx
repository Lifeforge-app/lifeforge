import { SearchInput, ViewModeSelector } from 'lifeforge-ui'
import { useState } from 'react'
import { toast } from 'react-toastify'

import { fetchAPI } from 'shared/lib'
import { ScoresLibraryControllersSchemas } from 'shared/types/controllers'

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
  sortType: string
  setSortType: React.Dispatch<React.SetStateAction<string>>
}) {
  const [requestRandomLoading, setRequestRandomLoading] = useState(false)

  async function requestRandomEntry() {
    setRequestRandomLoading(true)

    try {
      const entry = await fetchAPI<
        ScoresLibraryControllersSchemas.IEntries['getRandomEntry']['response']
      >(import.meta.env.VITE_API_HOST, '/scores-library/entries/random')

      const url = `${import.meta.env.VITE_API_HOST}/media/${entry.collectionId}/${
        entry.id
      }/${entry.pdf}`

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
        namespace="apps.scoresLibrary"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sideButtonIcon="tabler:dice"
        sideButtonLoading={requestRandomLoading}
        stuffToSearch="score"
        onSideButtonClick={requestRandomEntry}
      />
      <ViewModeSelector
        className="hidden md:flex"
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
