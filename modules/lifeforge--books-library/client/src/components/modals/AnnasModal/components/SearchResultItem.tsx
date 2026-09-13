import { useLocalStorage } from '@uidotdev/usehooks'
import { useMemo } from 'react'

import {
  Box,
  Button,
  ConfirmationModal,
  Flex,
  Icon,
  Text,
  useModalStore
} from '@lifeforge/ui'

import type { AnnasSearchResult } from '..'

function SearchResultItem({
  book
}: {
  book: AnnasSearchResult['results'][number]
}) {
  const { open } = useModalStore()

  const [bookmarkedBooks, setBookmarkedBooks] = useLocalStorage<
    AnnasSearchResult['results'][number][]
  >('books-library__bookmarks', [])

  const isBookmarked = useMemo(
    () => bookmarkedBooks?.some(b => b.md5 === book.md5),
    [bookmarkedBooks, book.md5]
  )

  const handleOpenDownloadPage = () => {
    window.open(
      `https://annas-archive.gl/md5/${book.md5}`,
      '_blank',
      'noopener,noreferrer'
    )
  }

  const handleToggleBookmark = () => {
    const isBookmarked = bookmarkedBooks?.some(b => b.md5 === book.md5)

    if (isBookmarked) {
      open(ConfirmationModal, {
        title: 'Remove Bookmark',
        description: 'Are you sure you want to remove this bookmark?',
        confirmationButton: {
          children: 'Remove',
          dangerous: true,
          icon: 'tabler:bookmark-off'
        },
        onConfirm: async () => {
          const updatedBookmarks = bookmarkedBooks?.filter(
            b => b.md5 !== book.md5
          )

          setBookmarkedBooks(updatedBookmarks)
        }
      })
    } else {
      const updatedBookmarks = [...(bookmarkedBooks || []), book]

      setBookmarkedBooks(updatedBookmarks)
    }
  }

  return (
    <Flex
      bg={{ base: 'bg-100', dark: 'bg-800' }}
      direction={{ base: 'column', md: 'row' }}
      gap="lg"
      p="lg"
      r="md"
    >
      <Flex
        bg={{ base: 'bg-200', dark: 'bg-800' }}
        flexShrink="0"
        minHeight="20rem"
        overflow="hidden"
        position="relative"
        r="md"
        width="14rem"
      >
        <Box
          asChild
          left="50%"
          position="absolute"
          style={{ transform: 'translate(-50%, -50%)' }}
          top="50%"
        >
          <Icon color="bg-700" icon="tabler:book-2" size="6em" />
        </Box>
        {book.coverUrl && (
          <img
            alt=""
            referrerPolicy="no-referrer"
            src={book.coverUrl}
            style={{
              position: 'relative',
              zIndex: 10,
              objectFit: 'cover',
              border: 'none'
            }}
          />
        )}
      </Flex>
      <Flex direction="column" width="100%">
        <Text
          color="muted"
          mb="xs"
          size="sm"
          weight="medium"
          wordBreak="break-all"
        >
          {book.filePath}
        </Text>
        <Text as="h2" size="2xl" weight="semibold">
          {book.title}
        </Text>
        {book.author && (
          <Text color="custom-500" mt="xs" size="base">
            {book.author}
          </Text>
        )}
        {book.description && (
          <Text color="muted" lineClamp={3} mt="xs" size="sm">
            {book.description}
          </Text>
        )}
        <Flex gap="xl" mt="lg" wrap="wrap">
          {[
            { label: 'Publisher', value: book.publisher },
            { label: 'Year', value: book.year },
            { label: 'Language', value: book.language },
            { label: 'Format', value: book.format },
            { label: 'Size', value: book.fileSize },
            { label: 'Type', value: book.type }
          ]
            .filter(item => item.value)
            .map(item => (
              <Box key={item.label}>
                <Text as="p" color="muted" size="sm" weight="medium">
                  {item.label}
                </Text>
                <Text as="p" size="base">
                  {item.value}
                </Text>
              </Box>
            ))}
        </Flex>
        <Box
          style={{
            marginTop: 'auto'
          }}
        >
          <Flex
            direction={{ base: 'column', lg: 'row' }}
            gap="xs"
            mt="lg"
            width="100%"
          >
            <Button
              flex="1"
              icon={isBookmarked ? 'tabler:bookmark-off' : 'tabler:bookmark'}
              variant="secondary"
              onClick={handleToggleBookmark}
            >
              {isBookmarked ? 'Remove Bookmark' : 'Bookmark'}
            </Button>
            <Button
              flex="1"
              icon="tabler:download"
              variant="primary"
              onClick={handleOpenDownloadPage}
            >
              Open Download Page
            </Button>
          </Flex>
        </Box>
      </Flex>
    </Flex>
  )
}

export default SearchResultItem
