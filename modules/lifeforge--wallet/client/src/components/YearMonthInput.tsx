import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { Flex, ListboxInput, ListboxOption, Text } from '@lifeforge/ui'

function YearMonthInput({
  month,
  setMonth,
  year,
  setYear,
  yearsOptions = [],
  monthsOptions = []
}: {
  month: number | null
  setMonth: (value: number | null) => void
  year: number | null
  setYear: (value: number | null) => void
  yearsOptions: number[]
  monthsOptions: number[]
}) {
  const { t } = useTranslation(['common.misc'])

  useEffect(() => {
    if (yearsOptions.length > 0) {
      setYear(yearsOptions[0])
    }
  }, [yearsOptions])

  useEffect(() => {
    if (monthsOptions.length > 0) {
      setMonth(monthsOptions[0])
    }
  }, [monthsOptions])

  return (
    <Flex align="center" direction={{ base: 'column', sm: 'row' }} gap="sm">
      <ListboxInput
        icon="tabler:calendar-month"
        label="Month"
        renderContent={() => (
          <Text truncate>
            {month !== null ? t(`dates.months.${month}`) : 'None'}
          </Text>
        )}
        value={month}
        onChange={setMonth}
      >
        {monthsOptions.map(mon => (
          <ListboxOption
            key={mon}
            label={t(`dates.months.${mon}`)}
            value={mon}
          />
        ))}
      </ListboxInput>
      <ListboxInput
        icon="tabler:calendar"
        label="Year"
        renderContent={() => <Text truncate>{year ?? 'None'}</Text>}
        value={year}
        onChange={setYear}
      >
        {yearsOptions.map(yr => (
          <ListboxOption key={yr} label={yr.toString()} value={yr} />
        ))}
      </ListboxInput>
    </Flex>
  )
}

export default YearMonthInput
