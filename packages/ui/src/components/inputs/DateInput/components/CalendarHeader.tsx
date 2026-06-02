import dayjs from 'dayjs'
import { range } from 'lodash'

import { Button, Listbox } from '@/components/inputs'
import { ListboxOption } from '@/components/inputs/ListboxInput/components/ListboxOption'
import { Flex, Text } from '@/components/primitives'
import { colorWithOpacity } from '@/system'

export function CalendarHeader({
  date,
  changeYear,
  changeMonth,
  decreaseMonth,
  increaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled
}: {
  date: Date
  changeYear: (year: number) => void
  changeMonth: (month: number) => void
  decreaseMonth: () => void
  increaseMonth: () => void
  prevMonthButtonDisabled: boolean
  nextMonthButtonDisabled: boolean
}) {
  const years = range(1990, dayjs().year() + 10)

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]

  return (
    <Text asChild color={{ base: 'bg-800', dark: 'bg-100' }}>
      <Flex
        align="center"
        justify="between"
        px="md"
        py="sm"
        onMouseDown={e => {
          e.stopPropagation()
        }}
      >
        <Button
          disabled={prevMonthButtonDisabled}
          icon="tabler:chevron-left"
          p="sm"
          variant="plain"
          onClick={decreaseMonth}
        />
        <Flex align="center" gap="sm">
          <Listbox<number>
            bg={{
              base: 'bg-100',
              hover: colorWithOpacity('bg-200', '50%'),
              dark: colorWithOpacity('bg-700', '50%'),
              darkHover: 'bg-700'
            }}
            pl="sm"
            pr="sm"
            py="sm"
            r="md"
            renderContent={value => <Text size="base">{value}</Text>}
            value={dayjs(date).year()}
            width="min-content"
            onChange={changeYear}
          >
            {years.map(option => (
              <ListboxOption key={option} label={`${option}`} value={option} />
            ))}
          </Listbox>
          <Listbox<string>
            bg={{
              base: 'bg-100',
              hover: colorWithOpacity('bg-200', '50%'),
              dark: colorWithOpacity('bg-700', '50%'),
              darkHover: 'bg-700'
            }}
            pl="sm"
            pr="sm"
            py="sm"
            r="md"
            renderContent={value => <Text size="base">{value}</Text>}
            value={months[dayjs(date).month()]}
            width="16em"
            onChange={value => changeMonth(months.indexOf(value))}
          >
            {months.map(option => (
              <ListboxOption key={option} label={option} value={option} />
            ))}
          </Listbox>
        </Flex>
        <Button
          disabled={nextMonthButtonDisabled}
          icon="tabler:chevron-right"
          p="sm"
          variant="plain"
          onClick={increaseMonth}
        />
      </Flex>
    </Text>
  )
}
