import { useReducer, useState } from 'react'
import { toast } from 'react-toastify'

import { usePromiseLoading } from '@lifeforge/shared'
import { useAPIEndpoint } from '@lifeforge/api'

import {
  EmptyStateScreen,
  ErrorScreen,
  LoadingScreen
} from '@/components/feedback'
import { Button, SearchInput } from '@/components/inputs'
import { Flex } from '@/components/primitives'
import { WithQueryData } from '@/components/utilities'
import { forgeAPI } from '@/utils/forgeAPI'

import { SearchFilterModal } from './components/SearchFilterModal'
import { SearchResults } from './components/SearchResults'
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

export function reducer(
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

export function Pixabay({
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
      const data = await forgeAPI.pixabay.searchImages
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
      controller={forgeAPI.checkAPIKeys({ keys: 'pixabay' }).setHost(apiHost)}
    >
      {exists =>
        exists ? (
          <>
            <Flex
              align="center"
              direction="column"
              minWidth="0"
              style={{ gap: '0.5rem' }}
              width="100%"
            >
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
                bg={{
                  base: 'bg-100',
                  dark: 'bg-800',
                  hover: 'bg-200',
                  darkHover: 'bg-700'
                }}
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
                icon="tabler:arrow-right"
                iconPosition="end"
                loading={loading}
                style={{ width: '100%' }}
                onClick={() => {
                  setPage(1)
                  onSearch(1).catch(console.error)
                }}
              >
                Search
              </Button>
            </Flex>
            <Flex direction="column" height="100%" mt="lg" style={{ flex: 1 }}>
              {(() => {
                switch (results) {
                  case 'error':
                    return (
                      <Flex
                        align="center"
                        height="100%"
                        justify="center"
                        style={{ flex: 1 }}
                      >
                        <ErrorScreen message="Failed to fetch data" />
                      </Flex>
                    )
                  case null:
                    return loading ? (
                      <Flex
                        align="center"
                        height="100%"
                        justify="center"
                        style={{ flex: 1 }}
                      >
                        <LoadingScreen />
                      </Flex>
                    ) : (
                      <Flex
                        align="center"
                        height="100%"
                        justify="center"
                        my="lg"
                        style={{ flex: 1 }}
                      >
                        <EmptyStateScreen
                          icon="simple-icons:pixabay"
                          message={{
                            id: 'pixabay',
                            namespace: 'common.modals',
                            tKey: 'imagePicker'
                          }}
                        />
                      </Flex>
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
            </Flex>
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
