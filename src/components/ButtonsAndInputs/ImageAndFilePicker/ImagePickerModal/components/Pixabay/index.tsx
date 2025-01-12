/* eslint-disable @typescript-eslint/member-delimiter-style */
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import Button from '@components/ButtonsAndInputs/Button'
import SearchInput from '@components/ButtonsAndInputs/SearchInput'
import EmptyStateScreen from '@components/Screens/EmptyStateScreen'
import ErrorScreen from '@components/Screens/ErrorScreen'
import LoadingScreen from '@components/Screens/LoadingScreen'
import {
  type IPixabaySearchFilter,
  type IPixabaySearchResult
} from '@interfaces/pixabay_interfaces'
import APIRequest from '@utils/fetchData'
import SearchResults from './components/SearchResults'

function Pixabay({
  file,
  setFile,
  setPreview,
  filters,
  setIsSearchFilterModalOpen
}: {
  file: string | File | null
  setFile: React.Dispatch<React.SetStateAction<string | File | null>>
  setPreview: React.Dispatch<React.SetStateAction<string | null>>
  filters: IPixabaySearchFilter
  setIsSearchFilterModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}): React.ReactElement {
  const [query, setQuery] = useState('')

  const [results, setResults] = useState<'error' | IPixabaySearchResult | null>(
    null
  )
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)

  async function onSearch(page: number): Promise<void> {
    if (loading) return

    if (query === '') {
      toast.error('Please enter a search query')
      return
    }

    setResults(null)
    setLoading(true)

    const params = new URLSearchParams({
      q: query,
      page: page.toString(), // TODO
      type: filters.imageType,
      category: filters.category,
      colors: filters.colors,
      editors_choice: filters.isEditorsChoice ? 'true' : 'false'
    })

    await APIRequest({
      endpoint: `pixabay/search?${params.toString()}`,
      method: 'GET',
      callback: data => {
        setResults(data.data)
      },
      onFailure: () => {
        setResults('error')
      },
      finalCallback: () => {
        setLoading(false)
      }
    })
  }

  return (
    <>
      <div className="flex w-full min-w-0 flex-col items-center gap-2 sm:flex-row">
        <SearchInput
          searchQuery={query}
          setSearchQuery={setQuery}
          stuffToSearch="pixabay"
          lighter
          hasTopMargin={false}
          onFilterIconClick={() => {
            setIsSearchFilterModalOpen(true)
          }}
          filterAmount={
            [
              filters.imageType !== 'all',
              filters.category,
              filters.colors,
              filters.isEditorsChoice
            ].filter(e => e).length
          }
          onKeyUp={e => {
            if (e.key === 'Enter') {
              setPage(1)
              onSearch(1).catch(console.error)
            }
          }}
        />
        <Button
          loading={loading}
          onClick={() => {
            setPage(1)
            onSearch(1).catch(console.error)
          }}
          icon="tabler:arrow-right"
          iconAtEnd
          className="w-full sm:w-auto"
        >
          Search
        </Button>
      </div>
      <div className="mt-6 flex h-full flex-1 flex-col">
        {(() => {
          switch (results) {
            case 'error':
              return (
                <div className="flex-center size-full flex-1">
                  <ErrorScreen message="Failed to fetch data" />
                </div>
              )
            case null:
              return loading ? (
                <div className="flex-center size-full flex-1">
                  <LoadingScreen />
                </div>
              ) : (
                <div className="flex-center mb-6 size-full flex-1">
                  <EmptyStateScreen
                    icon="simple-icons:pixabay"
                    title="Powered by Pixabay"
                    description="Search for images on Pixabay"
                  />
                </div>
              )
            default:
              return results.total === 0 ? (
                <EmptyStateScreen
                  icon="tabler:photo-off"
                  title="No results found"
                  description="Try searching with different keywords filters"
                />
              ) : (
                <SearchResults
                  results={results}
                  file={file}
                  setFile={setFile}
                  setPreview={setPreview}
                  page={page}
                  setPage={setPage}
                  onSearch={onSearch}
                />
              )
          }
        })()}
      </div>
    </>
  )
}

export default Pixabay
