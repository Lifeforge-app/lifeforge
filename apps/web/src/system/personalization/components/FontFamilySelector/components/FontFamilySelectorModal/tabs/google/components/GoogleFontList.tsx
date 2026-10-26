import { useRef } from 'react'

import {
  Box,
  EmptyStateScreen,
  Flex,
  Pagination,
  Scrollbar,
  Stack,
  useDivSize
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

  const containerRef = useRef<HTMLDivElement>(null)
  const { height, width } = useDivSize(containerRef)

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
    <Box ref={containerRef} flex="1" height="100%" width="100%">
      {width > 0 && height > 0 && (
        <Scrollbar ref={scrollableRef} style={{ height, width }}>
          <Stack px="sm">
            <Pagination
              page={page}
              totalPages={Math.ceil(filteredFonts.length / 10)}
              onPageChange={page => {
                setPage(page)
                scrollableRef.current?.scrollToTop()
              }}
            />
            {filteredFonts.slice((page - 1) * 10, page * 10).map(font => (
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
              totalPages={Math.ceil(filteredFonts.length / 10)}
              onPageChange={page => {
                setPage(page)
                scrollableRef.current?.scrollToTop()
              }}
            />
          </Stack>
        </Scrollbar>
      )}
    </Box>
  )
}

export default GoogleFontList
