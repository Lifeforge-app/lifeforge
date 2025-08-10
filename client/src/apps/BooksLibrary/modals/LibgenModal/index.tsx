import { Listbox, ListboxButton } from '@headlessui/react'
import { Icon } from '@iconify/react'
import forgeAPI from '@utils/forgeAPI'
import clsx from 'clsx'
import {
  Button,
  EmptyStateScreen,
  ListboxOption,
  ListboxOptions,
  LoadingScreen,
  ModalHeader,
  Pagination,
  QRCodeScanner,
  Scrollbar,
  SearchInput,
  useModalStore
} from 'lifeforge-ui'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import type { InferOutput } from 'shared'

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

export type LibgenSearchResult = InferOutput<
  typeof forgeAPI.booksLibrary.libgen.searchBooks
>

function LibgenModal({ onClose }: { onClose: () => void }) {
  const open = useModalStore(state => state.open)

  const [provider, setProvider] =
    useState<(typeof PROVIDERS)[number]>('libgen.is')

  const [searchQuery, setSearchQuery] = useState('')

  const [hasSearched, setHasSearched] = useState(false)

  const [data, setData] = useState<LibgenSearchResult | null>(null)

  const [loading, setLoading] = useState(false)

  const [totalPages, setTotalPages] = useState(0)

  const [viewDetailsFor, setViewDetailsFor] = useState<string | null>(null)

  const [providerOnlineStatuses, setProviderOnlineStatuses] = useState<
    Record<(typeof PROVIDERS)[number], boolean | 'loading'>
  >(() =>
    PROVIDERS.reduce(
      (acc, endpoint) => ({ ...acc, [endpoint]: 'loading' }),
      {} as Record<(typeof PROVIDERS)[number], boolean | 'loading'>
    )
  )

  async function checkLibgenOnlineStatus() {
    const promises = PROVIDERS.map(async endpoint => {
      try {
        await forgeAPI.corsAnywhere
          .input({ url: `https://${endpoint}` })
          .query({ timeout: 5000 })

        return { endpoint, ok: true }
      } catch {
        return { endpoint, ok: false }
      }
    })

    const results = await Promise.all(promises)

    const statusMap = results.reduce(
      (acc, { endpoint, ok }) => {
        acc[endpoint] = ok

        return acc
      },
      {} as Record<(typeof PROVIDERS)[number], boolean>
    )

    setProviderOnlineStatuses(prev => ({
      ...prev,
      ...statusMap
    }))
  }

  async function fetchBookResults(page: number) {
    setLoading(true)

    try {
      const response = await forgeAPI.booksLibrary.libgen.searchBooks
        .input({
          provider,
          req: searchQuery.trim(),
          page: page.toString()
        })
        .query()

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
          md5={viewDetailsFor}
          provider={provider}
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
              <ListboxOptions customWidth="min-w-48 w-[var(--button-width)]">
                {PROVIDERS.map(value => (
                  <ListboxOption
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
              </ListboxOptions>
            </Listbox>
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
                open(QRCodeScanner, {
                  formats: ['linear_codes'],
                  onScanned: data => {
                    setSearchQuery(data)
                  }
                })
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
                        <span className="text-bg-800 dark:text-bg-100">
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
                          provider={data.provider}
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
    </div>
  )
}

export default LibgenModal
