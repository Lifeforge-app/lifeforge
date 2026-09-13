import { Flex, Pagination, Stack, Text } from '@lifeforge/ui'

import type { AnnasSearchResult } from '..'
import SearchResultItem from './SearchResultItem'

function SearchResultList({
  data,
  currentPage,
  onPageChange
}: {
  data: AnnasSearchResult
  currentPage: number
  onPageChange: (page: number) => void
}) {
  return (
    <Flex direction="column" gap="xs">
      <Text as="p" color="muted" mt="md">
        {data.total} result
        {data.total !== 1 ? 's' : ''} found on page {currentPage} of{' '}
        {data.totalPages}
      </Text>
      <Pagination
        mb="md"
        page={currentPage}
        totalPages={data.totalPages || 1}
        onPageChange={onPageChange}
      />
      <Stack gap="sm">
        {data.results.map(book => (
          <SearchResultItem key={book.md5} book={book} />
        ))}
      </Stack>
      <Pagination
        mt="md"
        page={currentPage}
        totalPages={data.totalPages || 1}
        onPageChange={onPageChange}
      />
    </Flex>
  )
}

export default SearchResultList
