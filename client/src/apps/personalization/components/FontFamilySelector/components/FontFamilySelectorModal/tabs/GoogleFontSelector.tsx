import forgeAPI from '@/utils/forgeAPI'
import { useQuery } from '@tanstack/react-query'
import { useDebounce } from '@uidotdev/usehooks'
import {
  EmptyStateScreen,
  Listbox,
  ListboxOption,
  Pagination,
  Scrollbar,
  SearchInput,
  WithQuery
} from 'lifeforge-ui'
import _ from 'lodash'
import { useEffect, useMemo, useRef, useState } from 'react'
import { AutoSizer } from 'react-virtualized'
import { type InferOutput, usePersonalization } from 'shared'

import FontListItem from '../components/FontListItem'

export type FontFamily = InferOutput<
  typeof forgeAPI.user.personalization.listGoogleFonts
>['items'][number]

function GoogleFontSelector({
  selectedFont,
  setSelectedFont
}: {
  selectedFont: string | null
  setSelectedFont: (font: string | null) => void
}) {
  const { fontFamily } = usePersonalization()

  const fontsQuery = useQuery(
    forgeAPI.user.personalization.listGoogleFonts.queryOptions()
  )

  const pinnedFontsQuery = useQuery(
    forgeAPI.user.personalization.listGoogleFontsPin.queryOptions()
  )

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const [searchQuery, setSearchQuery] = useState<string>('')

  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  const [page, setPage] = useState(1)

  const scrollableRef = useRef<any>(null)

  const filteredFonts = useMemo(
    () =>
      fontsQuery.data?.items
        .filter(font => {
          return (
            (font.category === selectedCategory || !selectedCategory) &&
            font.family
              .toLowerCase()
              .includes(debouncedSearchQuery.toLowerCase())
          )
        })
        .sort((a, b) => {
          const aPinned = pinnedFontsQuery.data?.includes(a.family) ? 1 : 0

          const bPinned = pinnedFontsQuery.data?.includes(b.family) ? 1 : 0

          if (aPinned !== bPinned) {
            return bPinned - aPinned // Pinned fonts first
          }

          return a.family.localeCompare(b.family) // Then sort alphabetically
        }),
    [
      fontsQuery.data,
      selectedCategory,
      debouncedSearchQuery,
      pinnedFontsQuery.data
    ]
  )

  useEffect(() => {
    setPage(1)
    scrollableRef.current?.scrollToTop()
  }, [selectedCategory, debouncedSearchQuery])

  useEffect(() => {
    if (!fontsQuery.data) return

    const indexOfCurrentFontFamily = fontsQuery.data.items.findIndex(
      font => font.family === fontFamily
    )

    setPage(
      indexOfCurrentFontFamily !== -1
        ? Math.ceil((indexOfCurrentFontFamily + 1) / 10)
        : 1
    )
  }, [fontsQuery.data])

  return (
    <>
      <div className="mb-4 flex flex-col items-center gap-2 md:flex-row">
        <Listbox
          buttonContent={
            <span>{_.startCase(selectedCategory || '') || 'All category'}</span>
          }
          className="component-bg-lighter-with-hover md:max-w-56"
          value={selectedCategory}
          onChange={setSelectedCategory}
        >
          <ListboxOption key="all" label="All category" value={null} />
          {[...new Set(fontsQuery.data?.items.map(font => font.category))].map(
            category => (
              <ListboxOption
                key={category}
                label={_.startCase(category)}
                value={category}
              />
            )
          )}
        </Listbox>
        <SearchInput
          className="component-bg-lighter-with-hover"
          namespace="apps.personalization"
          searchTarget="fontFamily.items.fontFamily"
          value={searchQuery}
          onChange={setSearchQuery}
        />
      </div>
      <WithQuery query={pinnedFontsQuery}>
        {pinnedFontsData => (
          <WithQuery query={fontsQuery}>
            {data =>
              !data.enabled ? (
                <EmptyStateScreen
                  icon="tabler:key-off"
                  message={{
                    id: 'apiKey',
                    namespace: 'apps.personalization',
                    tKey: 'fontFamily'
                  }}
                />
              ) : filteredFonts!.length > 0 ? (
                <div className="h-full w-full flex-1">
                  <AutoSizer>
                    {({ height, width }) => (
                      <Scrollbar
                        ref={scrollableRef}
                        style={{
                          height: `${height}px`,
                          width: `${width}px`
                        }}
                      >
                        <div className="w-full space-y-3">
                          <Pagination
                            page={page}
                            totalPages={Math.ceil(filteredFonts!.length / 10)}
                            onPageChange={page => {
                              setPage(page)
                              scrollableRef.current?.scrollToTop()
                            }}
                          />
                          {filteredFonts
                            ?.slice((page - 1) * 10, page * 10)
                            .map(font => (
                              <FontListItem
                                key={font.family}
                                font={font}
                                isPinned={pinnedFontsData.some(
                                  pinnedFont => pinnedFont === font.family
                                )}
                                selectedFont={selectedFont}
                                setSelectedFont={setSelectedFont}
                              />
                            ))}
                          <Pagination
                            page={page}
                            totalPages={Math.ceil(filteredFonts!.length / 10)}
                            onPageChange={page => {
                              setPage(page)
                              scrollableRef.current?.scrollToTop()
                            }}
                          />
                        </div>
                      </Scrollbar>
                    )}
                  </AutoSizer>
                </div>
              ) : (
                <div className="flex-center flex-1">
                  <EmptyStateScreen
                    icon="tabler:search-off"
                    message={{
                      id: 'search',
                      namespace: 'apps.personalization',
                      tKey: 'fontFamily'
                    }}
                  />
                </div>
              )
            }
          </WithQuery>
        )}
      </WithQuery>
    </>
  )
}

export default GoogleFontSelector
