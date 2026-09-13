import type { BooksLibraryEntry } from '@'
import { useQuery } from '@tanstack/react-query'

import { Box, Card, ContextMenu, Flex, Icon, Text } from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import BookMeta from '../../components/BookMeta'
import EntryContextMenu from '../../components/EntryContextMenu'
import ReadStatusChip from '../../components/ReadStatusChip'

function EntryItem({ item }: { item: BooksLibraryEntry }) {
  const collectionsQuery = useQuery(forgeAPI.collections.list.queryOptions())

  return (
    <Card key={item.id} as="li">
      <Box position="absolute" right="1em" top="1em" zIndex="20">
        <ContextMenu>
          <EntryContextMenu item={item} />
        </ContextMenu>
      </Box>
      <Flex
        centered
        aspectRatio="9 / 12"
        bg={{ base: 'bg-200', dark: 'bg-800' }}
        overflow="hidden"
        position="relative"
        r="lg"
        style={{ isolation: 'isolate' }}
        width="100%"
      >
        <Box asChild height="100%" style={{ objectFit: 'cover' }}>
          <img
            alt=""
            loading="lazy"
            src={forgeAPI.getMedia({
              collectionId: item.collectionId,
              recordId: item.id,
              fieldId: item.thumbnail,
              thumb: '200x0'
            })}
          />
        </Box>
        <Box
          asChild
          left="50%"
          position="absolute"
          style={{ transform: 'translate(-50%, -50%)', zIndex: -1 }}
          top="50%"
          zIndex="-1"
        >
          <Icon
            color={{ base: 'bg-200', dark: 'bg-700' }}
            icon="tabler:book"
            size="5em"
          />
        </Box>
      </Flex>
      <Flex direction="column" flex="1" minWidth="0" mt="lg" width="100%">
        <ReadStatusChip item={item} />
        {collectionsQuery.data &&
          (() => {
            const collection = collectionsQuery.data.find(
              collection => collection.id === item.collection
            )

            return collection !== undefined ? (
              <Flex align="center" gap="xs" mt="xs">
                <Icon color="muted" icon={collection.icon} size="1em" />
                <Text color="muted" size="sm" weight="medium">
                  {collection.name}
                </Text>
              </Flex>
            ) : null
          })()}
        <Text lineClamp={3} mt="xs" size="xl" weight="medium">
          {item.title}{' '}
          {item.edition !== '' && (
            <Text as="span" color="muted" size="sm">
              ({item.edition} ed)
            </Text>
          )}
        </Text>
        <Text
          color="custom-500"
          lineClamp={3}
          mt="xs"
          size="sm"
          weight="medium"
          wordBreak="break-all"
        >
          {item.authors}
        </Text>
        <Box
          minWidth="0"
          style={{
            marginTop: 'auto'
          }}
          width="100%"
        >
          <BookMeta isGridView item={item} />
        </Box>
      </Flex>
    </Card>
  )
}

export default EntryItem
