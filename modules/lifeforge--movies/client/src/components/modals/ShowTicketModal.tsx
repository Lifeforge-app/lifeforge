import dayjs from 'dayjs'
import { QRCodeSVG } from 'qrcode.react'

import { Box, Flex, Icon, ModalHeader, Stack, Text } from '@lifeforge/ui'

import type { MovieEntry } from '../..'

function ShowTicketModal({
  data: { entry },
  onClose
}: {
  data: {
    entry: MovieEntry | null
  }
  onClose: () => void
}) {
  const ticketFields = [
    { icon: 'tabler:map-pin', label: entry?.theatre_location || 'N/A' },
    {
      icon: 'tabler:calendar',
      label: entry?.theatre_showtime
        ? dayjs(entry.theatre_showtime).format('DD MMM YYYY, h:mm a')
        : 'N/A'
    },
    {
      icon: 'tabler:hash',
      label: `Theatre No. ${entry?.theatre_number || 'N/A'}`
    },
    {
      icon: 'mdi:love-seat-outline',
      label: entry?.theatre_seat || 'N/A'
    }
  ]

  return (
    <Box maxWidth="20rem">
      <ModalHeader icon="tabler:ticket" title="ticket.view" onClose={onClose} />
      {entry && (
        <>
          <Flex centered width="100%">
            <Flex
              centered
              aspectRatio="1 / 1"
              bg="bg-100"
              height="auto"
              maxWidth="20rem"
              p="2xl"
              r="lg"
              width="100%"
            >
              <QRCodeSVG
                style={{ width: '100%', height: '100%' }}
                value={entry.ticket_number}
              />
            </Flex>
          </Flex>
          <Text as="h2" mt="lg" size="xl" weight="medium">
            {entry.title}
          </Text>
          <Stack gap="sm" mt="lg">
            {ticketFields.map(item => (
              <Flex key={item.icon} align="center" gap="sm">
                <Icon color="muted" icon={item.icon} />
                <Text color="muted">{item.label}</Text>
              </Flex>
            ))}
          </Stack>
        </>
      )}
    </Box>
  )
}

export default ShowTicketModal
