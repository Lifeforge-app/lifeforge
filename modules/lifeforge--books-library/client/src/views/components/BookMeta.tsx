import type { BooksLibraryEntry } from '@'
import { useQuery } from '@tanstack/react-query'
import humanNumber from 'human-number'
import prettyBytes from 'pretty-bytes'

import { Box, Flex, Icon, Text } from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

function Separator({ isGridView }: { isGridView?: boolean }) {
  return (
    <Icon
      color="muted"
      display={{ base: isGridView ? 'none' : 'block', sm: 'block' }}
      icon="tabler:circle-filled"
      mx="xs"
      size="0.25em"
    />
  )
}

function MetaItem({
  icon,
  children
}: {
  icon: string
  children: React.ReactNode
}) {
  return (
    <Flex align="center" flexShrink="0" style={{ whiteSpace: 'nowrap' }}>
      <Icon color="muted" icon={icon} mr="xs" size="1em" />
      <Text color="muted">{children}</Text>
    </Flex>
  )
}

function BookMeta({
  item,
  isGridView = false
}: {
  item: BooksLibraryEntry
  isGridView?: boolean
}) {
  const languagesQuery = useQuery(forgeAPI.languages.list.queryOptions())

  return (
    <Flex align="center" gap="xs" minWidth="0" mt="md" width="100%" wrap="wrap">
      {item.page_count !== 0 && (
        <>
          <MetaItem icon="tabler:file-text">
            {humanNumber(item.page_count)} pages
          </MetaItem>
          <Separator />
        </>
      )}
      {item.word_count !== 0 && (
        <>
          <MetaItem icon="tabler:text-size">
            {humanNumber(item.word_count)} words
          </MetaItem>
          <Separator />
        </>
      )}
      {languagesQuery.data &&
        (() => {
          const langs = languagesQuery.data.filter(language =>
            item.languages?.includes(language.id)
          )

          return (
            langs.length > 0 && (
              <>
                {langs.map((lang, i) => (
                  <Flex key={lang.id} align="center" gap="sm">
                    <Icon color="muted" icon={lang.icon} size="1em" />
                    <Text color="muted">{lang.name}</Text>
                    {i !== langs.length - 1 && (
                      <Icon
                        color="muted"
                        display={{
                          base: isGridView ? 'none' : 'block',
                          sm: 'block'
                        }}
                        icon="tabler:circle-filled"
                        size="0.25em"
                      />
                    )}
                  </Flex>
                ))}
                <Separator />
              </>
            )
          )
        })()}
      {item.year_published !== 0 && (
        <>
          <MetaItem icon="tabler:clock">{item.year_published}</MetaItem>
          <Separator />
        </>
      )}
      {item.publisher !== '' && (
        <>
          <Flex
            align="center"
            flexShrink="0"
            style={{ whiteSpace: 'nowrap' }}
            width={{ base: '100%', sm: 'auto' }}
          >
            <Icon
              color="muted"
              icon="tabler:user"
              mr="xs"

              size="1em"
            />
            <Box asChild maxWidth={{ base: '11rem', sm: '12rem' }} minWidth="0">
              <Text truncate color="muted">
                {item.publisher}
              </Text>
            </Box>
          </Flex>
          <Separator />
        </>
      )}
      <MetaItem icon="tabler:dimensions">
        {prettyBytes(+item.size || 0)}
      </MetaItem>
      <Separator />
      <MetaItem icon="tabler:file-text">{item.extension}</MetaItem>
    </Flex>
  )
}

export default BookMeta
