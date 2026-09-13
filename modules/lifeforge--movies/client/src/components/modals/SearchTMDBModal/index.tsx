import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

import type { InferOutput } from '@lifeforge/api'
import {
  Box,
  Button,
  EmptyStateScreen,
  Flex,
  ModalHeader,
  SearchInput,
  Text,
  WithQuery,
  surface,
  toast
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import TMDBLogo from './components/TMDBLogo'
import TMDBResultsList from './components/TMDBResultsList'

export type TMDBSearchResults = InferOutput<typeof forgeAPI.tmdb.search>

function SearchTMDBModal({
  onClose,
  data: { searchQuery: initialQuery = '', tgvId }
}: {
  onClose: () => void
  data: {
    searchQuery?: string
    tgvId?: string
  }
}) {
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [queryToSearch, setQueryToSearch] = useState(initialQuery)
  const [page, setPage] = useState(1)

  const searchResultsQuery = useQuery(
    forgeAPI.tmdb.search
      .input({
        q: queryToSearch,
        page: page.toString()
      })
      .queryOptions({
        enabled: !!queryToSearch
      })
  )

  const onAddToLibrary = async () => {
    await queryClient.invalidateQueries({
      queryKey: forgeAPI.entries.key
    })

    await queryClient.invalidateQueries({
      queryKey: forgeAPI.tmdb.search.input({
        q: queryToSearch,
        page: page.toString()
      }).key
    })

    if (tgvId) onClose()

    toast.success('Movie added to your library!')
  }

  return (
    <Box minWidth="70vw">
      <ModalHeader
        appendTitle={
          <Text
            as="p"
            color="muted"
            display={{ base: 'block', sm: 'inline' }}
            style={{ flexShrink: 0, textAlign: 'right' }}
          >
            powered by&nbsp;
            <Text
              as="a"
              decoration="underline"
              href="https://iconify.design"
              rel="noreferrer"
              target="_blank"
            >
              <Box asChild display="inline" height="1rem">
                <TMDBLogo />
              </Box>
            </Text>
          </Text>
        }
        icon="tabler:movie"
        title="Search TMDB"
        onClose={onClose}
      />
      <Flex align="center" direction={{ base: 'column', sm: 'row' }} gap="xs">
        <SearchInput
          bg={surface.lightInteractive}
          searchTarget="movie"
          value={searchQuery}
          onChange={setSearchQuery}
          onKeyUp={e => {
            if (e.key === 'Enter') {
              if (searchQuery.trim() !== '') {
                setPage(1)
                setQueryToSearch(searchQuery.trim())
              }
            }
          }}
        />
        <Button
          disabled={searchQuery.trim() === ''}
          icon="tabler:arrow-right"
          iconPosition="end"
          loading={searchResultsQuery.isLoading}
          width={{ base: '100%', sm: 'auto' }}
          onClick={() => {
            setPage(1)
            setQueryToSearch(searchQuery.trim())
          }}
        >
          search
        </Button>
      </Flex>
      <Box mt="lg">
        {queryToSearch ? (
          <WithQuery query={searchResultsQuery}>
            {searchResults => (
              <TMDBResultsList
                page={page}
                results={searchResults}
                setPage={setPage}
                tgvId={tgvId}
                onAddToLibrary={onAddToLibrary}
              />
            )}
          </WithQuery>
        ) : (
          <Box height="24rem">
            <EmptyStateScreen
              icon={
                <Box asChild height="6rem">
                  <TMDBLogo />
                </Box>
              }
              message={{
                id: 'tmdb'
              }}
            />
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default SearchTMDBModal
