import forgeAPI from '@/utils/forgeAPI'
import { useReducer, useState } from 'react'
import { toast } from 'react-toastify'
import { useAPIEndpoint, usePromiseLoading } from 'shared'

import {
  EmptyStateScreen,
  ErrorScreen,
  LoadingScreen
} from '@components/feedback'
import { Button, SearchInput } from '@components/inputs'
import { WithQueryData } from '@components/utilities'

import SearchFilterModal from './components/SearchFilterModal'
import SearchResults from './components/SearchResults'
import {
  type IPixabaySearchFilter,
  type IPixabaySearchResult,
  type PixabaySearchFilterAction
} from './typescript/pixabay_interfaces'

const initialFilter: IPixabaySearchFilter = {
  imageType: 'all',
  category: undefined,
  colors: undefined,
  isEditorsChoice: false
}

function reducer(
  state: IPixabaySearchFilter,
  action: PixabaySearchFilterAction
): typeof initialFilter {
  switch (action.type) {
    case 'SET_IMAGE_TYPE':
      return { ...state, imageType: action.payload }
    case 'SET_CATEGORY':
      return { ...state, category: action.payload }
    case 'SET_COLORS':
      return { ...state, colors: action.payload }
    case 'SET_IS_EDITORS_CHOICE':
      return { ...state, isEditorsChoice: action.payload }
    default:
      return state
  }
}

function Pixabay({
  file,
  setFile,
  setPreview
}: {
  file: string | File | null
  setFile: React.Dispatch<React.SetStateAction<string | File | null>>
  setPreview: React.Dispatch<React.SetStateAction<string | null>>
}) {
  const apiHost = useAPIEndpoint()

  const [query, setQuery] = useState('')

  const [results, setResults] = useState<'error' | IPixabaySearchResult | null>(
    null
  )

  const [page, setPage] = useState(1)

  const [filters, updateFilters] = useReducer(reducer, initialFilter)

  const [isSearchFilterModalOpen, setIsSearchFilterModalOpen] = useState(false)

  const [loading, onSearch] = usePromiseLoading(async (page: number) => {
    if (loading) return

    if (query === '') {
      toast.error('Please enter a search query')

      return
    }

    setResults(null)

    try {
      const data = await forgeAPI
        .untyped('/pixabay/searchImages')
        .setHost(apiHost)
        .input({
          q: query,
          page: page.toString(),
          type: filters.imageType,
          category: filters.category,
          colors: filters.colors,
          editors_choice: filters.isEditorsChoice ? 'true' : 'false'
        })
        .query()

      setResults(data)
    } catch {
      setResults('error')
    }
  })

  return (
    <WithQueryData
      controller={forgeAPI
        .untyped('/apiKeys/entries/checkKeys')
        .setHost(apiHost)
        .input({
          keys: 'pixabay'
        })}
    >
      {exists =>
        exists ? (
          <>
            <div className="flex w-full min-w-0 flex-col items-center gap-2 sm:flex-row">
              <SearchInput
                actionButtonProps={{
                  icon: 'tabler:filter',
                  onClick: () => {
                    setIsSearchFilterModalOpen(true)
                  },
                  children: [
                    filters.imageType !== 'all',
                    filters.category,
                    filters.colors,
                    filters.isEditorsChoice
                  ].filter(e => e).length
                }}
                className="component-bg-lighter-with-hover"
                namespace="common.modals"
                searchTarget="imagePicker.items.pixabay"
                value={query}
                onChange={setQuery}
                onKeyUp={e => {
                  if (e.key === 'Enter') {
                    setPage(1)
                    onSearch(1).catch(console.error)
                  }
                }}
              />
              <Button
                className="w-full sm:w-auto"
                icon="tabler:arrow-right"
                iconPosition="end"
                loading={loading}
                onClick={() => {
                  setPage(1)
                  onSearch(1).catch(console.error)
                }}
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
                      <div className="flex-center my-6 size-full flex-1">
                        <EmptyStateScreen
                          icon="simple-icons:pixabay"
                          message={{
                            id: 'pixabay',
                            namespace: 'common.modals',
                            tKey: 'imagePicker'
                          }}
                        />
                      </div>
                    )
                  default:
                    return results.total === 0 ? (
                      <EmptyStateScreen
                        icon="tabler:photo-off"
                        message={{
                          id: 'results',
                          namespace: 'common.modals',
                          tKey: 'imagePicker'
                        }}
                      />
                    ) : (
                      <SearchResults
                        file={file}
                        page={page}
                        results={results}
                        setFile={setFile}
                        setPage={setPage}
                        setPreview={setPreview}
                        onSearch={onSearch}
                      />
                    )
                }
              })()}
            </div>
            <SearchFilterModal
              filters={filters}
              isOpen={isSearchFilterModalOpen}
              updateFilters={updateFilters}
              onClose={() => {
                setIsSearchFilterModalOpen(false)
              }}
            />
          </>
        ) : (
          <EmptyStateScreen
            icon="tabler:key-off"
            message={{
              id: 'noAPIKey',
              namespace: 'common.modals',
              tKey: 'imagePicker'
            }}
          />
        )
      }
    </WithQueryData>
  )
}

export default Pixabay
