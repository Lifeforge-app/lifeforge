import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

import type { InferOutput } from '@lifeforge/api'
import { useModuleTranslation } from '@lifeforge/localization'
import {
  Box,
  Button,
  Card,
  Flex,
  Icon,
  Text,
  colorWithOpacity,
  surface,
  useModalStore
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import ScreeningDetailsModal from '../../ScreeningDetailsModal'
import SearchTMDBModal from '../../SearchTMDBModal'

dayjs.extend(duration)

export type TGVMovie = InferOutput<typeof forgeAPI.tgv.list>['movies'][number]

function TGVMovieItem({
  data,
  isAdded,
  tab
}: {
  data: TGVMovie
  isAdded: boolean
  tab: string
}) {
  const { open } = useModalStore()
  const { t } = useModuleTranslation()

  const handleAddToLibrary = () => {
    open(SearchTMDBModal, {
      searchQuery: data.name,
      tgvId: data.recid
    })
  }

  const metadataItems = [
    {
      icon: 'tabler:category',
      label: t('metadata.genres'),
      value: data.genres.join(', ')
    },
    {
      icon: 'tabler:clock',
      label: t('metadata.duration'),
      value: data.duration
        ? dayjs.duration(data.duration, 'minutes').format('H [h] mm [m]')
        : 'TBA'
    },
    {
      icon: 'uil:globe',
      label: t('metadata.language'),
      value: data.language
    }
  ]

  return (
    <Card bg={surface.light} direction="column" gap="md" minWidth="0">
      <Flex
        centered
        bg={{ base: 'bg-200', dark: colorWithOpacity('bg-700', '40%') }}
        overflow="hidden"
        position="relative"
        r="md"
        aspectRatio="27/40"
        style={{ isolation: 'isolate' }}
      >
        <Box
          asChild
          left="50%"
          position="absolute"
          style={{ transform: 'translate(-50%, -50%)' }}
          top="50%"
          zIndex="-1"
        >
          <Icon
            color={{ base: 'bg-300', dark: 'bg-700' }}
            icon="tabler:movie"
            size="4.5em"
          />
        </Box>
        <Box
          asChild
          bg={surface.light}
          height="100%"
          width="100%"
          r="md"
          style={{ objectFit: 'contain' }}
        >
          <img alt="" src={data.poster} />
        </Box>
      </Flex>
      <Flex direction="column" flex="1" minWidth="0">
        <Text color="custom-500" mb="xs" weight="semibold">
          {data.release_date ? dayjs(data.release_date).year() : 'TBA'}
        </Text>
        <Text as="h1" size="xl" weight="semibold">
          {data.name}
        </Text>
        <Text color="muted" lineClamp={2} mt="xs">
          {data.overview}
        </Text>
        <Flex mt="md" style={{ gap: '1rem 2rem' }} wrap="wrap">
          {metadataItems.map(({ icon, label, value }) => (
            <Box key={label}>
              <Flex align="center" gap="xs" mb="xs">
                <Icon color="muted" icon={icon} />
                <Text color="muted" weight="medium">
                  {label}
                </Text>
              </Flex>
              <Text>{value}</Text>
            </Box>
          ))}
        </Flex>
        <Flex
          align="end"
          direction="column"
          flex="1"
          gap="xs"
          justify="end"
          minWidth="0"
          mt="lg"
        >
          {tab === 'nowShowing' && (
            <Button
              icon="tabler:movie"
              variant="secondary"
              width="100%"
              onClick={() =>
                open(ScreeningDetailsModal, {
                  movieId: data.recid,
                  movie: data
                })
              }
            >
              Screening Details
            </Button>
          )}
          <Button
            disabled={isAdded}
            icon="tabler:plus"
            variant={isAdded ? 'plain' : 'primary'}
            width="100%"
            onClick={handleAddToLibrary}
          >
            {isAdded ? 'Already in Library' : 'Add to Library'}
          </Button>
        </Flex>
      </Flex>
    </Card>
  )
}

export default TGVMovieItem
