import { Icon } from '@iconify/react/dist/iconify.js'
import { useLocalStorage } from '@uidotdev/usehooks'
import forgeAPI from '@utils/forgeAPI'
import {
  Button,
  EmptyStateScreen,
  LoadingScreen,
  ModalHeader,
  Pagination,
  Scrollbar,
  SearchInput
} from 'lifeforge-ui'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { type InferOutput, usePromiseLoading } from 'shared'

import SearchResultItem from './components/SearchResultItem'

export type AnnasSearchResult = InferOutput<
  typeof forgeAPI.booksLibrary.annas.search
>

function AnnasModal({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation('apps.booksLibrary')

  const [searchQuery, setSearchQuery] = useState('')

  const [hasSearched, setHasSearched] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)

  const [data, setData] = useState<AnnasSearchResult | null>(null)

  const [bookmarkedBooks] = useLocalStorage<
    AnnasSearchResult['results'][number][] | null
  >('books-library__bookmarks')

  async function fetchBookResults(page: number = 1) {
    if (searchQuery.trim() === '') {
      toast.error('Please enter a search query')

      return
    }

    setHasSearched(true)

    try {
      const response = await forgeAPI.booksLibrary.annas.search
        .input({
          q: searchQuery.trim(),
          page: page.toString()
        })
        .query()

      if (response.success) {
        setData(response.results.length === 0 ? null : response)
        setCurrentPage(response.currentPage || page)
      } else {
        toast.error(response.error || 'Failed to fetch search results')
        setData(null)
      }
    } catch (error) {
      toast.error('Failed to fetch search results')
      setData(null)
      console.error("Anna's Archive search error:", error)
    }
  }

  const [loading, triggerFetch] = usePromiseLoading(fetchBookResults)

  function handleSearch() {
    setCurrentPage(1)
    triggerFetch(1)
  }

  function handlePageChange(page: number) {
    triggerFetch(page)
  }

  useEffect(() => {
    setHasSearched(false)
    setSearchQuery('')
    setCurrentPage(1)
  }, [])

  return (
    <div className="flex min-h-[80vh] min-w-[70vw] flex-col">
      <ModalHeader
        icon="tabler:archive"
        namespace="apps.booksLibrary"
        title="Anna's Archive"
        onClose={onClose}
      />
      <div className="flex flex-col items-center gap-2 sm:flex-row">
        <SearchInput
          className="component-bg-lighter-with-hover"
          namespace="apps.booksLibrary"
          searchTarget="libgenBook"
          setValue={setSearchQuery}
          value={searchQuery}
          onKeyUp={e => {
            if (e.key === 'Enter') {
              handleSearch()
            }
          }}
        />
        <Button
          className="w-full sm:w-auto"
          icon="tabler:arrow-right"
          iconPosition="end"
          loading={loading}
          onClick={handleSearch}
        >
          search
        </Button>
      </div>
      <Scrollbar className="mt-4 flex-1">
        {(() => {
          if (loading) {
            return <LoadingScreen />
          }

          if (bookmarkedBooks && bookmarkedBooks.length > 0 && !hasSearched) {
            return (
              <div>
                <div className="mt-4 mb-6 flex items-center gap-4">
                  <div className="shadow-custom bg-custom-500/10 rounded-lg p-3">
                    <Icon
                      className="text-custom-500 size-8"
                      icon="tabler:bookmark"
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xl font-medium">
                      {t('bookmarkedBooks')}
                    </p>
                    <p className="text-bg-500 text-sm font-light">
                      {t('bookmarkedBooksDesc', {
                        number: bookmarkedBooks.length
                      })}
                    </p>
                  </div>
                </div>
                <ul className="space-y-3">
                  {bookmarkedBooks.map(book => (
                    <SearchResultItem key={book.md5} book={book} />
                  ))}
                </ul>
              </div>
            )
          }

          if (hasSearched) {
            if (data === null) {
              return (
                <EmptyStateScreen
                  icon="tabler:books-off"
                  name="annasResult"
                  namespace="apps.booksLibrary"
                />
              )
            }

            return (
              <>
                <div className="mb-4 space-y-1">
                  <p className="text-bg-500 text-lg font-medium">
                    Search results for{' '}
                    <span className="text-bg-800 dark:text-bg-100">
                      &quot;{data.query}&quot;
                    </span>
                  </p>
                  <p className="text-bg-500 text-sm font-light">
                    {data.total} result{data.total !== 1 ? 's' : ''} found on
                    page {currentPage} of {data.totalPages}
                  </p>
                </div>
                <Pagination
                  className="mb-4"
                  currentPage={currentPage}
                  totalPages={data.totalPages || 1}
                  onPageChange={handlePageChange}
                />
                <ul className="space-y-3">
                  {data.results.map(book => (
                    <SearchResultItem key={book.md5} book={book} />
                  ))}
                </ul>
                <Pagination
                  className="mt-4"
                  currentPage={currentPage}
                  totalPages={data.totalPages || 1}
                  onPageChange={handlePageChange}
                />
              </>
            )
          }

          return (
            <EmptyStateScreen
              icon="tabler:archive"
              name="annas"
              namespace="apps.booksLibrary"
            />
          )
        })()}
      </Scrollbar>
    </div>
  )
}

export default AnnasModal
