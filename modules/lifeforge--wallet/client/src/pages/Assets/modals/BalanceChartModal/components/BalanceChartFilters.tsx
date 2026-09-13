import dayjs from 'dayjs'

import { useModuleTranslation } from '@lifeforge/localization'
import {
  DateInput,
  Flex,
  ListboxInput,
  ListboxOption,
  Stack,
  Text
} from '@lifeforge/ui'

import { RANGE_MODE } from '..'

function BalanceChartFilters({
  rangeMode,
  setRangeMode,
  startDate,
  setStartDate,
  endDate,
  setEndDate
}: {
  rangeMode: (typeof RANGE_MODE)[number]
  setRangeMode: (value: (typeof RANGE_MODE)[number]) => void
  startDate: Date | null
  setStartDate: (date: Date | null) => void
  endDate: Date | null
  setEndDate: (date: Date | null) => void
}) {
  const { t } = useModuleTranslation()

  return (
    <Stack gap="lg" mb="2xl">
      <ListboxInput
        icon="tabler:history"
        label="range mode"
        renderContent={() => <Text>{t(`rangeModes.${rangeMode}`)}</Text>}
        value={rangeMode}
        onChange={setRangeMode}
      >
        {RANGE_MODE.map(mode => (
          <ListboxOption
            key={mode}
            label={t(`rangeModes.${mode}`)}
            value={mode}
          />
        ))}
      </ListboxInput>
      {rangeMode === 'custom' && (
        <Flex gap="sm" width="100%">
          <DateInput
            icon="tabler:calendar-up"
            label="startDate"
            value={startDate}
            onChange={(date: Date | null) => {
              setStartDate(date)

              if (endDate && date && dayjs(date).isAfter(dayjs(endDate))) {
                setEndDate(date)
              }
            }}
          />
          <DateInput
            icon="tabler:calendar-down"
            label="endDate"
            value={endDate}
            onChange={(date: Date | null) => {
              setEndDate(date)

              if (startDate && date && dayjs(date).isBefore(dayjs(startDate))) {
                setStartDate(date)
              }
            }}
          />
        </Flex>
      )}
    </Stack>
  )
}

export default BalanceChartFilters
