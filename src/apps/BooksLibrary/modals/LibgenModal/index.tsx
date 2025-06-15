import { Icon } from '@iconify/react/dist/iconify.js'
import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import {
  Button,
  EmptyStateScreen,
  LoadingScreen,
  ModalHeader,
  Pagination,
  QRCodeScanner,
  Scrollbar,
  SearchInput
} from '@lifeforge/ui'

import fetchAPI from '@utils/fetchAPI'

import Details from './components/Details'
import SearchResultItem from './components/SearchResultItem'

function LibgenModal({ onClose }: { onClose: () => void }) {
  const [libgenOnline, setLibgenOnline] = useState<'loading' | boolean>(
    'loading'
  )
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
  const [qrcodeScannerOpen, setQrcodeScannerOpen] = useState(false)

  async function checkLibgenOnlineStatus() {
    try {
      const isOnline = await fetchAPI<boolean>('books-library/libgen/status', {
        timeout: 5000
      })
      setLibgenOnline(isOnline)
    } catch {
      setLibgenOnline(false)
    }
  }

  async function fetchBookResults(page: number) {
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

  async function searchBooks() {
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
    setLibgenOnline('loading')
    checkLibgenOnlineStatus()
    setHasSearched(false)
    setSearchQuery('')
  }, [])

  return (
    <div className="flex min-h-[80vh] min-w-[70vw] flex-col">
      <ModalHeader
        appendTitle={
          libgenOnline === 'loading' ? (
            <Icon className="text-bg-500 size-4" icon="svg-spinners:180-ring" />
          ) : (
            <div
              className={clsx(
                'flex-center gap-1 rounded-full px-2 py-0.5 text-sm font-medium',
                libgenOnline
                  ? 'bg-green-500/20 text-green-500'
                  : 'bg-red-500/20 text-red-500'
              )}
            >
              <Icon className="size-2" icon="tabler:circle-filled" />
              <span>{libgenOnline === true ? 'Online' : 'Offline'}</span>
            </div>
          )
        }
        icon="tabler:books"
        namespace="apps.booksLibrary"
        title="Library Genesis"
        onClose={onClose}
      />
      {viewDetailsFor !== null ? (
        <Details
          id={viewDetailsFor}
          onClose={() => {
            setViewDetailsFor(null)
          }}
        />
      ) : (
        <>
          <div className="flex flex-col items-center gap-2 sm:flex-row">
            <SearchInput
              namespace="apps.booksLibrary"
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              sideButtonIcon="tabler:scan"
              stuffToSearch="Libgen Book"
              onKeyUp={e => {
                if (e.key === 'Enter') {
                  searchBooks().catch(console.error)
                }
              }}
              onSideButtonClick={() => {
                setQrcodeScannerOpen(true)
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
                      namespace="apps.booksLibrary"
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
                  namespace="apps.booksLibrary"
                />
              )
            })()}
          </Scrollbar>
        </>
      )}
      <QRCodeScanner
        formats={['linear_codes']}
        isOpen={qrcodeScannerOpen}
        onClose={() => {
          setQrcodeScannerOpen(false)
        }}
        onScanned={data => {
          setSearchQuery(data)
          setQrcodeScannerOpen(false)
        }}
      />
    </div>
  )
}

export default LibgenModal
