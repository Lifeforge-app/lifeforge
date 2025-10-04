import forgeAPI from '@/utils/forgeAPI'
import { SearchInput, ViewModeSelector } from 'lifeforge-ui'
import { useState } from 'react'
import { toast } from 'react-toastify'

import useFilter from '../hooks/useFilter'
import SortBySelector from './SortBySelector'

function Searchbar() {
  const { searchQuery, setSearchQuery, view, updateFilter } = useFilter()

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
    <div className="mt-4 flex flex-col gap-2 md:flex-row">
      <SortBySelector />
      <SearchInput
        actionButtonProps={{
          icon: 'tabler:dice',
          onClick: requestRandomEntry,
          loading: requestRandomLoading,
          variant: 'plain'
        }}
        className="bg-bg-50"
        namespace="apps.scoresLibrary"
        searchTarget="score"
        setValue={setSearchQuery}
        value={searchQuery}
      />
      <ViewModeSelector
        className="bg-bg-50 hidden md:flex"
        options={[
          { value: 'list', icon: 'uil:list-ul' },
          { value: 'grid', icon: 'uil:apps' }
        ]}
        setViewMode={mode => updateFilter('view', mode)}
        viewMode={view}
      />
    </div>
  )
}

export default Searchbar
