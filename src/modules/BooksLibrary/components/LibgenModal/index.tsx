import { useBooksLibraryContext } from '@providers/BooksLibraryProvider'
import fetchAPI from '@utils/fetchAPI'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import {
  Button,
  EmptyStateScreen,
  LoadingScreen,
  ModalHeader,
  ModalWrapper,
  Pagination,
  Scrollbar,
  SearchInput
} from '@lifeforge/ui'

import AddToLibraryModal from '../AddToLibraryModal'
import Details from './components/Details'
import SearchResultItem from './components/SearchResultItem'

function LibgenModal(): React.ReactElement {
  const {
    miscellaneous: { libgenModalOpen: isOpen, setLibgenModalOpen: setOpen }
  } = useBooksLibraryContext()
  const [searchQuery, setSearchQuery] = useState('')
  const [hasSearched, setHasSearched] = useState(false)
  const [data, setData] = useState<{
    query: string
    resultsCount: string
    page: number
    data: Array<Record<string, any>>
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [totalPages, setTotalPages] = useState(0)
  const [viewDetailsFor, setViewDetailsFor] = useState<string | null>(null)
  const [addToLibraryFor, setAddToLibraryFor] = useState<string | null>(null)

  async function fetchBookResults(page: number): Promise<void> {
    setLoading(true)

    try {
      const response = await fetchAPI<{
        query: string
        resultsCount: string
        page: number
        data: Array<Record<string, any>>
      }>(
        `books-library/libgen/search?req=${searchQuery}&lg_topic=libgen&open=0&view=detailed&res=25&column=def&phrase=0&sort=year&sortmode=DESC&page=${
          page ?? 1
        }`
      )

      setData(response.data.length === 0 ? null : response)
      setTotalPages(Math.ceil(parseInt(response.resultsCount) / 25))
    } catch {
      toast.error('Failed to fetch search results')
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  async function searchBooks(): Promise<void> {
    if (loading) return

    if (searchQuery.trim() === '') {
      toast.error('Please enter a search query')
      return
    }

    setHasSearched(true)

    await fetchBookResults(1)

    setLoading(false)
  }

  useEffect(() => {
    if (isOpen) {
      setHasSearched(false)
      setSearchQuery('')
    }
  }, [isOpen])

  return (
    <>
      <ModalWrapper isOpen={isOpen} minHeight="80vh" minWidth="70vw">
        <ModalHeader
          icon="tabler:books"
          namespace="modules.booksLibrary"
          title="Library Genesis"
          onClose={() => {
            setOpen(false)
          }}
        />
        {viewDetailsFor !== null ? (
          <Details
            id={viewDetailsFor}
            setAddToLibraryFor={setAddToLibraryFor}
            onClose={() => {
              setViewDetailsFor(null)
            }}
          />
        ) : (
          <>
            <div className="flex flex-col items-center gap-2 sm:flex-row">
              <SearchInput
                hasTopMargin={false}
                namespace="modules.booksLibrary"
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                stuffToSearch="Libgen Book"
                onKeyUp={e => {
                  if (e.key === 'Enter') {
                    searchBooks().catch(console.error)
                  }
                }}
              />
              <Button
                iconAtEnd
                className="w-full sm:w-auto"
                icon="tabler:arrow-right"
                loading={loading}
                onClick={() => {
                  searchBooks().catch(console.error)
                }}
              >
                search
              </Button>
            </div>
            <Scrollbar className="mt-4 flex-1">
              {(() => {
                if (loading) {
                  return <LoadingScreen />
                }

                if (hasSearched) {
                  if (data === null) {
                    return (
                      <EmptyStateScreen
                        icon="tabler:books-off"
                        name="libgenResult"
                        namespace="modules.booksLibrary"
                      />
                    )
                  }

                  return (
                    <>
                      <div className="mb-4 space-y-1">
                        <p className="text-bg-500 text-lg font-medium">
                          Search results for{' '}
                          <span className="text-bg-900 dark:text-bg-100">
                            &quot;{data.query}&quot;
                          </span>
                        </p>
                        <p className="text-bg-500 text-sm font-light">
                          {data.resultsCount}
                        </p>
                      </div>
                      <Pagination
                        className="mb-4"
                        currentPage={data.page}
                        totalPages={totalPages}
                        onPageChange={page => {
                          fetchBookResults(page).catch(console.error)
                        }}
                      />
                      <ul className="space-y-4">
                        {data.data.map((book: any) => (
                          <SearchResultItem
                            key={book.id}
                            book={book}
                            setAddToLibraryFor={setAddToLibraryFor}
                            setViewDetailsFor={setViewDetailsFor}
                          />
                        ))}
                      </ul>
                      <Pagination
                        className="mt-4"
                        currentPage={data.page}
                        totalPages={totalPages}
                        onPageChange={page => {
                          fetchBookResults(page).catch(console.error)
                        }}
                      />
                    </>
                  )
                }

                return (
                  <EmptyStateScreen
                    icon="tabler:book"
                    name="libgen"
                    namespace="modules.booksLibrary"
                  />
                )
              })()}
            </Scrollbar>
          </>
        )}
      </ModalWrapper>
      <AddToLibraryModal
        isOpen={addToLibraryFor !== null}
        md5={addToLibraryFor}
        onClose={() => {
          setAddToLibraryFor(null)
        }}
      />
    </>
  )
}

export default LibgenModal
