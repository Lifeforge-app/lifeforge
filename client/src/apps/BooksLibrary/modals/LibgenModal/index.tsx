import { Listbox, ListboxButton } from '@headlessui/react'
import { Icon } from '@iconify/react'
import clsx from 'clsx'
import {
  Button,
  EmptyStateScreen,
  ListboxOrComboboxOption,
  ListboxOrComboboxOptions,
  LoadingScreen,
  ModalHeader,
  Pagination,
  QRCodeScanner,
  Scrollbar,
  SearchInput
} from 'lifeforge-ui'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { fetchAPI } from 'shared/lib'

import Details from './components/Details'
import SearchResultItem from './components/SearchResultItem'

const PROVIDERS = [
  'libgen.is',
  'libgen.li',
  'libgen.gs',
  'libgen.vg',
  'libgen.pg',
  'libgen.gl'
] as const

function LibgenModal({ onClose }: { onClose: () => void }) {
  const [provider, setProvider] =
    useState<(typeof PROVIDERS)[number]>('libgen.is')

  const [searchQuery, setSearchQuery] = useState('')

  const [hasSearched, setHasSearched] = useState(false)

  const [data, setData] = useState<{
    provider: (typeof PROVIDERS)[number]
    query: string
    resultsCount: string
    page: number
    data: Array<Record<string, any>>
  } | null>(null)

  const [loading, setLoading] = useState(false)

  const [totalPages, setTotalPages] = useState(0)

  const [viewDetailsFor, setViewDetailsFor] = useState<string | null>(null)

  const [qrcodeScannerOpen, setQrcodeScannerOpen] = useState(false)

  const [providerOnlineStatuses, setProviderOnlineStatuses] = useState<
    Record<(typeof PROVIDERS)[number], boolean | 'loading'>
  >(() =>
    PROVIDERS.reduce(
      (acc, endpoint) => ({ ...acc, [endpoint]: 'loading' }),
      {} as Record<(typeof PROVIDERS)[number], boolean | 'loading'>
    )
  )

  async function checkLibgenOnlineStatus() {
    for (const endpoint of PROVIDERS) {
      try {
        await fetchAPI(
          import.meta.env.VITE_API_HOST,
          `cors-anywhere?url=https://${endpoint}`,
          {
            timeout: 5000
          }
        )

        setProviderOnlineStatuses(prev => ({
          ...prev,
          [endpoint]: true
        }))
      } catch {
        setProviderOnlineStatuses(prev => ({
          ...prev,
          [endpoint]: false
        }))
      }
    }
  }

  async function fetchBookResults(page: number) {
    setLoading(true)

    try {
      const response = await fetchAPI<{
        provider: (typeof PROVIDERS)[number]
        query: string
        resultsCount: string
        page: number
        data: Array<Record<string, any>>
      }>(
        import.meta.env.VITE_API_HOST,
        `books-library/libgen/search?provider=${provider}&req=${searchQuery}&page=${
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
    if (
      loading ||
      providerOnlineStatuses[provider] === 'loading' ||
      !providerOnlineStatuses[provider]
    ) {
      return
    }

    if (searchQuery.trim() === '') {
      toast.error('Please enter a search query')

      return
    }

    setHasSearched(true)

    await fetchBookResults(1)

    setLoading(false)
  }

  useEffect(() => {
    setProviderOnlineStatuses(() =>
      PROVIDERS.reduce(
        (acc, endpoint) => ({ ...acc, [endpoint]: 'loading' }),
        {} as Record<(typeof PROVIDERS)[number], boolean | 'loading'>
      )
    )
    checkLibgenOnlineStatus()
    setHasSearched(false)
    setSearchQuery('')
  }, [])

  return (
    <div className="flex min-h-[80vh] min-w-[70vw] flex-col">
      <ModalHeader
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
            <Listbox
              as="div"
              className="relative w-full sm:w-auto"
              value={provider}
              onChange={value => {
                setProvider(value)
              }}
            >
              <ListboxButton className="flex-between shadow-custom component-bg-lighter-with-hover flex w-full gap-2 rounded-md p-4 sm:w-48">
                <div className="flex items-center gap-2">
                  {(() => {
                    if (providerOnlineStatuses[provider] === 'loading') {
                      return (
                        <Icon
                          className="text-bg-500 size-5"
                          icon="svg-spinners:180-ring"
                        />
                      )
                    }

                    return (
                      <span
                        className={clsx(
                          'inline-block size-3 rounded-full',
                          providerOnlineStatuses[provider]
                            ? 'bg-green-500'
                            : 'bg-red-500'
                        )}
                      />
                    )
                  })()}
                  <span className="font-medium whitespace-nowrap">
                    {PROVIDERS.find(value => value === provider) ?? 'Unknown'}
                  </span>
                </div>
                <Icon
                  className="text-bg-500 size-5"
                  icon="tabler:chevron-down"
                />
              </ListboxButton>
              <ListboxOrComboboxOptions customWidth="min-w-48 w-[var(--button-width)]">
                {PROVIDERS.map(value => (
                  <ListboxOrComboboxOption
                    key={value}
                    color={(() => {
                      if (providerOnlineStatuses[value] === 'loading') {
                        return 'oklch(70.8% 0 0)'
                      }

                      return providerOnlineStatuses[value]
                        ? 'oklch(79.2% 0.209 151.711)'
                        : 'oklch(63.7% 0.237 25.331)'
                    })()}
                    icon={
                      providerOnlineStatuses[value] === 'loading'
                        ? 'svg-spinners:180-ring'
                        : undefined
                    }
                    text={value}
                    value={value}
                  />
                ))}
              </ListboxOrComboboxOptions>
            </Listbox>
            <SearchInput
              lighter
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
              disabled={providerOnlineStatuses[provider] === false}
              icon="tabler:arrow-right"
              loading={
                loading || providerOnlineStatuses[provider] === 'loading'
              }
              onClick={() => {
                searchBooks().catch(console.error)
              }}
            >
              search
            </Button>
          </div>
          <Scrollbar className="mt-4 flex-1">
            {(() => {
              if (loading || providerOnlineStatuses[provider] === 'loading') {
                return <LoadingScreen />
              }

              if (!providerOnlineStatuses[provider]) {
                return (
                  <EmptyStateScreen
                    icon="tabler:cloud-off"
                    name="libgenOffline"
                    namespace="apps.booksLibrary"
                  />
                )
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
                          isLibgenIS={data.provider === 'libgen.is'}
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
