import { useMutation } from '@tanstack/react-query'
import dayjs from 'dayjs'

import { usePromiseLoading } from '@lifeforge/api'
import {
  Box,
  Button,
  Card,
  Flex,
  Icon,
  Text,
  surface,
  toast
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import type { TMDBSearchResults } from '..'

function TMDBResultItem({
  data,
  isAdded,
  tgvId,
  onAddToLibrary
}: {
  data: TMDBSearchResults['results'][number]
  isAdded: boolean
  tgvId?: string
  onAddToLibrary: () => Promise<void>
}) {
  const addToLibraryMutation = useMutation(
    forgeAPI.entries.create
      .input({
        id: data.id.toString()
      })
      .mutationOptions({
        onSuccess: async () => {
          await onAddToLibrary()
        },
        onError: (error: unknown) => {
          toast.error(
            `Failed to add movie: ${(error as Error).message || 'Unknown error'}`
          )
        }
      })
  )

  const [loading, onSubmit] = usePromiseLoading(() =>
    addToLibraryMutation.mutateAsync({ tgvId })
  )

  return (
    <Card bg={surface.light} direction={{ base: 'column', md: 'row' }} gap="md">
      <Box
        bg={{ base: 'bg-200', dark: 'bg-800' }}
        height="12rem"
        overflow="hidden"
        position="relative"
        r="md"
        style={{ isolation: 'isolate', width: '8rem', flexShrink: 0 }}
      >
        <Icon
          color={{ base: 'bg-300', dark: 'bg-700' }}
          icon="tabler:movie"
          size="4.5em"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: -1
          }}
        />
        <img
          alt=""
          src={`http://image.tmdb.org/t/p/w154/${data.poster_path}`}
          style={{ objectFit: 'contain', borderRadius: '0.375rem' }}
        />
      </Box>
      <Flex direction="column" width="100%">
        <Text color="custom-500" weight="semibold">
          {dayjs(data.release_date).year()}
        </Text>
        <Text as="h1" size="xl" weight="semibold">
          {data.title}{' '}
          <Text as="span" color="muted" size="base" weight="medium">
            ({data.original_title})
          </Text>
        </Text>
        <Text color="muted" lineClamp={2} mt="xs">
          {data.overview}
        </Text>
        <Flex align="end" flex="1">
          <Button
            disabled={tgvId ? false : isAdded}
            icon={tgvId ? 'tabler:link' : 'tabler:plus'}
            loading={loading}
            mt="md"
            variant={tgvId ? 'primary' : isAdded ? 'plain' : 'primary'}
            width="100%"
            onClick={onSubmit}
          >
            {tgvId
              ? 'Link to Library'
              : isAdded
                ? 'Already in Library'
                : 'Add to Library'}
          </Button>
        </Flex>
      </Flex>
    </Card>
  )
}

export default TMDBResultItem
