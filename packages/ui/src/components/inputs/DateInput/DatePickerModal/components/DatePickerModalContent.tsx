import { Button } from '@/components/inputs'
import { ModalHeader } from '@/components/overlays'
import { Box, Flex } from '@/components/primitives'

import { useDatePicker } from '../contexts/DatePickerContext'
import { CalendarGrid } from './CalendarGrid'
import { CalendarHeader } from './CalendarHeader'
import { TimeSelector } from './TimeSelector'

export function DatePickerModalContent({
  icon,
  namespace,
  onClose
}: {
  icon?: string
  namespace?: string | false
  onClose: () => void
}) {
  const { onConfirm, hasTime } = useDatePicker()

  return (
    <Box minWidth={{ base: '100%', sm: '24rem' }}>
      <ModalHeader
        icon={icon || (hasTime ? 'tabler:clock' : 'tabler:calendar')}
        namespace={namespace}
        title={
          namespace === false
            ? hasTime
              ? 'Select Date Time'
              : 'Select Date'
            : hasTime
              ? 'datePicker.titleWithTime'
              : 'datePicker.title'
        }
        onClose={onClose}
      />

      <Flex direction="column" gap="sm" width="100%">
        <CalendarHeader />
        <CalendarGrid />
        {hasTime && <TimeSelector />}
      </Flex>

      <Button icon="tabler:check" mt="lg" width="100%" onClick={onConfirm}>
        Confirm
      </Button>
    </Box>
  )
}
