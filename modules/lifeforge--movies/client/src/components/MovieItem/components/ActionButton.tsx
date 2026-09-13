import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useCallback } from 'react'

import { useModuleTranslation } from '@lifeforge/localization'
import {
  Button,
  Flex,
  Icon,
  Text,
  useModalStore,
  usePersonalization
} from '@lifeforge/ui'

import ShowTicketModal from '../../modals/ShowTicketModal'
import { useMovieItemContext } from '../contexts/MovieItemContext'
import { useToggleWatched } from '../hooks/useToggleWatched'

dayjs.extend(relativeTime)

function ActionButton() {
  const { data, type } = useMovieItemContext()
  const { t } = useModuleTranslation()
  const { language } = usePersonalization()
  const { open } = useModalStore()

  const handleToggleWatched = useToggleWatched({
    id: data.id,
    title: data.title,
    is_watched: data.is_watched
  })

  const handleShowTicket = useCallback(() => {
    open(ShowTicketModal, { entry: data })
  }, [data, open])

  return (
    <Flex
      align="end"
      direction={type === 'grid' ? 'column' : { base: 'column', md: 'row' }}
      flex="1"
      gap="xs"
      justify="end"
      mt="lg"
    >
      {!data.is_watched && (
        <Button
          flex={type === 'grid' ? 'none' : { base: 'none', md: '1' }}
          icon="tabler:check"
          variant="secondary"
          width="100%"
          onClick={handleToggleWatched}
        >
          Mark as Watched
        </Button>
      )}
      {data.ticket_number && (
        <Button
          flex={type === 'grid' ? 'none' : { base: 'none', md: '1' }}
          icon="tabler:ticket"
          variant={data.is_watched ? 'secondary' : 'primary'}
          width="100%"
          onClick={handleShowTicket}
        >
          Show Ticket
        </Button>
      )}
      {data.is_watched && (
        <Flex
          centered
          color="muted"
          flex={type === 'grid' ? 'none' : { base: 'none', md: '1' }}
          gap="sm"
          mt={type === 'grid' ? 'md' : { base: 'md', md: 'none' }}
          py="md"
          width="100%"
        >
          <Icon color="muted" icon="tabler:check" />
          <Text color="muted">
            {t('misc.watched', {
              date: dayjs(data.watch_date).locale(language).fromNow()
            })}
          </Text>
        </Flex>
      )}
    </Flex>
  )
}

export default ActionButton
