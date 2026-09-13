import { useLocalStorage } from '@uidotdev/usehooks'
import { useEffect } from 'react'
import { AutoSizer } from 'react-virtualized'

import { type InferOutput } from '@lifeforge/api'
import {
  Button,
  EmptyStateScreen,
  Flex,
  LoadingScreen,
  ModalHeader,
  Scrollbar,
  SearchInput,
  surface
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import BookmarkedList from './components/BookmarkedList'
import SearchResultList from './components/SearchResultList'
import { useSearchResults } from './hooks/useSearchResults'

export type AnnasSearchResult = InferOutput<typeof forgeAPI.annas.search>

function AnnasModal({ onClose }: { onClose: () => void }) {
  const {
    searchQuery,
    setSearchQuery,
    hasSearched,
    setHasSearched,
    currentPage,
    data,
    loading,
    handleSearch
  } = useSearchResults()

  const [bookmarkedBooks] = useLocalStorage<
    AnnasSearchResult['results'][number][] | null
  >('books-library__bookmarks')

  useEffect(() => {
    setHasSearched(false)
    setSearchQuery('')
  }, [])

  return (
    <Flex direction="column" minHeight="80vh" minWidth="70vw">
      <ModalHeader
        icon="tabler:archive"
        title="Anna's Archive"
        onClose={onClose}
      />
      <Flex align="center" direction={{ base: 'column', sm: 'row' }} gap="xs">
        <SearchInput
          bg={surface.lightInteractive}
          searchTarget="libgenBook"
          value={searchQuery}
          onChange={setSearchQuery}
          onClear={() => {
            setHasSearched(false)
          }}
          onKeyUp={e => {
            if (e.key === 'Enter') {
              handleSearch()
            }
          }}
        />
        <Button
          icon="tabler:arrow-right"
          iconPosition="end"
          loading={loading}
          width={{ base: '100%', sm: 'auto' }}
          onClick={handleSearch}
        >
          search
        </Button>
      </Flex>
      <Flex direction="column" flex="1">
        <AutoSizer>
          {({ width, height }) => (
            <Scrollbar mt="md" style={{ width, height }}>
              {(() => {
                if (loading) {
                  return <LoadingScreen />
                }

                if (
                  bookmarkedBooks &&
                  bookmarkedBooks.length > 0 &&
                  !hasSearched
                ) {
                  return <BookmarkedList books={bookmarkedBooks} />
                }

                if (hasSearched) {
                  if (data === null) {
                    return (
                      <EmptyStateScreen
                        icon="tabler:books-off"
                        message={{
                          id: 'annasResult'
                        }}
                      />
                    )
                  }

                  return (
                    <SearchResultList
                      currentPage={currentPage}
                      data={data}
                      onPageChange={handleSearch}
                    />
                  )
                }

                return (
                  <EmptyStateScreen
                    icon="tabler:archive"
                    message={{
                      id: 'annas'
                    }}
                  />
                )
              })()}
            </Scrollbar>
          )}
        </AutoSizer>
      </Flex>
    </Flex>
  )
}

export default AnnasModal
