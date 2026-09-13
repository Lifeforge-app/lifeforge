import {
  Box,
  ContextMenu,
  Flex,
  ModuleHeader,
  SearchInput
} from '@lifeforge/ui'

import { ViewModes } from '@/views'

import MovieCreationMenu from './MovieCreationMenu'

function MovieHeader({
  searchQuery,
  onSearchChange
}: {
  searchQuery: string
  onSearchChange: (value: string) => void
}) {
  return (
    <>
      <ModuleHeader trailing={<MovieCreationMenu variant="desktop" />} />
      <Flex align="center" as="header" gap="xs">
        <SearchInput
          debounceMs={300}
          searchTarget="movie"
          value={searchQuery}
          onChange={onSearchChange}
        />
        <ViewModes.Selector />
        <Box display={{ base: 'block', md: 'none' }}>
          <ContextMenu>
            <ViewModes.ContextMenuSelector />
          </ContextMenu>
        </Box>
      </Flex>
      <MovieCreationMenu variant="mobile" />
    </>
  )
}

export default MovieHeader
