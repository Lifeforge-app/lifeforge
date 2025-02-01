import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Button } from '@components/buttons'
import { SearchInput } from '@components/inputs'
import ModalHeader from '@components/modals/ModalHeader'
import ModalWrapper from '@components/modals/ModalWrapper'
import EmptyStateScreen from '@components/screens/EmptyStateScreen'
import LoadingScreen from '@components/screens/LoadingScreen'
import Scrollbar from '@components/utilities/Scrollbar'
import { useBooksLibraryContext } from '@providers/BooksLibraryProvider'
import APIRequest from '@utils/fetchData'
import Details from './components/Details'
import SearchResultItem from './components/SearchResultItem'
import Pagination from '../../../../components/utilities/Pagination'
import AddToLibraryModal from '../AddToLibraryModal'

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

    return await APIRequest({
      endpoint: `books-library/libgen/search?req=${searchQuery}&lg_topic=libgen&open=0&view=detailed&res=25&column=def&phrase=0&sort=year&sortmode=DESC&page=${
        page ?? 1
      }`,
      method: 'GET',
      callback: (response: any) => {
        setData(response.data.data.length === 0 ? null : response.data)
        setTotalPages(Math.ceil(parseInt(response.data.resultsCount) / 25))
      },
      finalCallback: () => {
        setLoading(false)
      }
    })
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
      <ModalWrapper isOpen={isOpen} minWidth="70vw" minHeight="80vh">
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
            onClose={() => {
              setViewDetailsFor(null)
            }}
            setAddToLibraryFor={setAddToLibraryFor}
          />
        ) : (
          <>
            <div className="flex flex-col items-center gap-2 sm:flex-row">
              <SearchInput
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                stuffToSearch="Libgen Book"
                namespace="modules.booksLibrary"
                hasTopMargin={false}
                onKeyUp={e => {
                  if (e.key === 'Enter') {
                    searchBooks().catch(console.error)
                  }
                }}
              />
              <Button
                onClick={() => {
                  searchBooks().catch(console.error)
                }}
                icon="tabler:arrow-right"
                iconAtEnd
                loading={loading}
                className="w-full sm:w-auto"
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
                        namespace="modules.booksLibrary"
                        name="libgenResult"
                      />
                    )
                  }

                  return (
                    <>
                      <div className="mb-4 space-y-1">
                        <p className="text-lg font-medium text-bg-500">
                          Search results for{' '}
                          <span className="text-bg-900 dark:text-bg-100">
                            &quot;{data.query}&quot;
                          </span>
                        </p>
                        <p className="text-sm font-light text-bg-500">
                          {data.resultsCount}
                        </p>
                      </div>
                      <Pagination
                        currentPage={data.page}
                        totalPages={totalPages}
                        onPageChange={page => {
                          fetchBookResults(page).catch(console.error)
                        }}
                        className="mb-4"
                      />
                      <ul className="space-y-4">
                        {data.data.map((book: any) => (
                          <SearchResultItem
                            key={book.id}
                            book={book}
                            setViewDetailsFor={setViewDetailsFor}
                            setAddToLibraryFor={setAddToLibraryFor}
                          />
                        ))}
                      </ul>
                      <Pagination
                        currentPage={data.page}
                        totalPages={totalPages}
                        onPageChange={page => {
                          fetchBookResults(page).catch(console.error)
                        }}
                        className="mt-4"
                      />
                    </>
                  )
                }

                return (
                  <EmptyStateScreen
                    icon="tabler:book"
                    namespace="modules.booksLibrary"
                    name="libgen"
                  />
                )
              })()}
            </Scrollbar>
          </>
        )}
      </ModalWrapper>
      <AddToLibraryModal
        isOpen={addToLibraryFor !== null}
        onClose={() => {
          setAddToLibraryFor(null)
        }}
        md5={addToLibraryFor}
      />
    </>
  )
}

export default LibgenModal
