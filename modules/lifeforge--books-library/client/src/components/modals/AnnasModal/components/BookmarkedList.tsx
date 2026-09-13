import { useModuleTranslation } from '@lifeforge/localization'
import { Flex, Icon, Stack, Text, colorWithOpacity } from '@lifeforge/ui'

import type { AnnasSearchResult } from '..'
import SearchResultItem from './SearchResultItem'

function BookmarkedList({
  books
}: {
  books: AnnasSearchResult['results'][number][]
}) {
  const { t } = useModuleTranslation()

  return (
    <Stack>
      <Flex align="center" gap="md" mb="md" mt="lg">
        <Flex shadow bg={colorWithOpacity('custom-500', '10%')} p="sm" r="lg">
          <Icon color="custom-500" icon="tabler:bookmark" size="2em" />
        </Flex>
        <Stack gap="xs">
          <Text size="xl" weight="medium">
            {t('bookmarkedBooks')}
          </Text>
          <Text color="muted" size="sm">
            {t('bookmarkedBooksDesc', {
              number: books.length
            })}
          </Text>
        </Stack>
      </Flex>
      {books.map(book => (
        <SearchResultItem key={book.md5} book={book} />
      ))}
    </Stack>
  )
}

export default BookmarkedList
