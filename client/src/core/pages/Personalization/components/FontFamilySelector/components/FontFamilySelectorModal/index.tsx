import { useUserPersonalization } from '@providers/UserPersonalizationProvider'
import { useQuery } from '@tanstack/react-query'
import { useDebounce } from '@uidotdev/usehooks'
import forgeAPI from '@utils/forgeAPI'
import {
  Button,
  EmptyStateScreen,
  Listbox,
  ListboxOption,
  ModalHeader,
  Pagination,
  Scrollbar,
  SearchInput,
  WithQuery
} from 'lifeforge-ui'
import _ from 'lodash'
import { useEffect, useMemo, useRef, useState } from 'react'
import type Scrollbars from 'react-custom-scrollbars'
import { toast } from 'react-toastify'
import { AutoSizer } from 'react-virtualized'
import { type InferOutput, usePersonalization } from 'shared'

import FontListItem from './components/FontListItem'

export type FontFamily = InferOutput<
  typeof forgeAPI.user.personalization.listGoogleFonts
>['items'][number]

function FontFamilySelectorModal({ onClose }: { onClose: () => void }) {
  const fontsQuery = useQuery(
    forgeAPI.user.personalization.listGoogleFonts.queryOptions()
  )

  const { fontFamily } = usePersonalization()

  const { changeFontFamily } = useUserPersonalization()

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const [searchQuery, setSearchQuery] = useState<string>('')

  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  const [page, setPage] = useState(1)

  const [selectedFont, setSelectedFont] = useState<string | null>(fontFamily)

  const scrollableRef = useRef<Scrollbars>(null)

  const filteredFonts = useMemo(
    () =>
      fontsQuery.data?.items.filter(font => {
        return (
          (font.category === selectedCategory || !selectedCategory) &&
          font.family.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
        )
      }),
    [fontsQuery.data, selectedCategory, debouncedSearchQuery]
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
    <div className="flex h-full min-h-[80vh] min-w-[60vw] flex-col">
      <ModalHeader
        icon="tabler:text-size"
        namespace="core.personalization"
        title="fontFamily.modals.fontFamilySelector"
        onClose={onClose}
      />
      <div className="mb-4 flex flex-col items-center gap-2 md:flex-row">
        <Listbox
          buttonContent={
            <span>{_.startCase(selectedCategory || '') || 'All category'}</span>
          }
          className="md:max-w-56"
          setValue={setSelectedCategory}
          value={selectedCategory}
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
          namespace="core.personalization"
          searchTarget="fontFamily.inputs.fontFamily"
          setValue={setSearchQuery}
          value={searchQuery}
        />
      </div>
      <WithQuery query={fontsQuery}>
        {data =>
          !data.enabled ? (
            <EmptyStateScreen
              icon="tabler:key-off"
              name="apiKey"
              namespace="core.personalization"
              tKey="fontFamily"
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
                        currentPage={page}
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
                            selectedFont={selectedFont}
                            setSelectedFont={setSelectedFont}
                          />
                        ))}
                      <Pagination
                        currentPage={page}
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
                name="search"
                namespace="core.personalization"
                tKey="fontFamily"
              />
            </div>
          )
        }
      </WithQuery>
      {selectedFont && selectedFont !== fontFamily && (
        <Button
          className="mt-6"
          icon="tabler:check"
          onClick={() => {
            changeFontFamily(selectedFont)
            onClose()
            toast.success('Font family changed successfully!')
          }}
        >
          Select
        </Button>
      )}
    </div>
  )
}

export default FontFamilySelectorModal
