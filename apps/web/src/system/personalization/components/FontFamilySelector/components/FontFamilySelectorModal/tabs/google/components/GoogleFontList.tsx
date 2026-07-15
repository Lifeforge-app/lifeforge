import { AutoSizer } from 'react-virtualized'

import {
  Box,
  EmptyStateScreen,
  Flex,
  Pagination,
  Scrollbar,
  Stack
} from '@lifeforge/ui'

import { useGoogleFont } from '../contexts/GoogleFontContext'
import FontListItem from './FontListItem'

function GoogleFontList({
  pinnedFonts,
  fontsEnabled
}: {
  pinnedFonts: string[]
  fontsEnabled: boolean
}) {
  const {
    selectedFont,
    setSelectedFont,
    filteredFonts,
    page,
    scrollableRef,
    setPage
  } = useGoogleFont()

  if (!fontsEnabled) {
    return (
      <Flex centered flex="1">
        <EmptyStateScreen
          icon="tabler:key-off"
          message={{
            id: 'apiKey',
            namespace: 'common.personalization',
            tKey: 'fontFamily'
          }}
        />
      </Flex>
    )
  }

  if (filteredFonts.length === 0) {
    return (
      <Flex centered flex="1">
        <EmptyStateScreen
          icon="tabler:search-off"
          message={{
            id: 'search',
            namespace: 'common.personalization',
            tKey: 'fontFamily'
          }}
        />
      </Flex>
    )
  }

  return (
    <Box flex="1" height="100%" width="100%">
      <AutoSizer>
        {({ height, width }) => (
          <Scrollbar
            ref={scrollableRef}
            style={{
              height: `${height}px`,
              width: `${width}px`
            }}
          >
            <Stack px="sm">
              <Pagination
                page={page}
                totalPages={Math.ceil(filteredFonts!.length / 10)}
                onPageChange={page => {
                  setPage(page)
                  scrollableRef.current?.scrollToTop()
                }}
              />
              {filteredFonts?.slice((page - 1) * 10, page * 10).map(font => (
                <FontListItem
                  key={font.family}
                  font={font}
                  isPinned={pinnedFonts.some(pf => pf === font.family)}
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
            </Stack>
          </Scrollbar>
        )}
      </AutoSizer>
    </Box>
  )
}

export default GoogleFontList
