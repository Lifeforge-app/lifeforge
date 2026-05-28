import { useTranslation } from 'react-i18next'

import { ListboxInput, ListboxOption, NumberInput } from '@components/inputs'
import { Box, Flex, Text } from '@components/primitives'

import type { FreqSpecificParams } from '..'

export const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const

export function WeeklyForm({
  data,
  setData
}: {
  data: FreqSpecificParams['weekly']
  setData: (data: FreqSpecificParams['weekly']) => void
}) {
  const { t } = useTranslation(['apps.calendar', 'common.misc'])

  return (
    <Flex direction="column" gap="md" width="100%">
      <Flex align="center" gap="md" width="100%">
        <Box flex="1">
          <NumberInput
            required
            icon="tabler:repeat"
            label={t('inputs.weekly.inputs.every')}
            value={data.every}
            onChange={every => setData({ ...data, every })}
          />
        </Box>
        <Text color="muted">{t('inputs.weekly.inputs.weeks')}</Text>
      </Flex>
      <ListboxInput
        multiple
        required
        buttonContent={
          <>
            {data.onDays
              .map(day => t(`common.misc:dates.days.${DAYS.indexOf(day)}`))
              .join(', ')}
          </>
        }
        customActive={data.onDays.length > 0}
        icon="tabler:calendar"
        label={t('inputs.weekly.inputs.onDays')}
        value={data.onDays}
        onChange={onDays => setData({ ...data, onDays: onDays })}
      >
        {DAYS.map(day => (
          <ListboxOption
            key={day}
            label={t(`common.misc:dates.days.${DAYS.indexOf(day)}`)}
            value={day}
          />
        ))}
      </ListboxInput>
    </Flex>
  )
}
