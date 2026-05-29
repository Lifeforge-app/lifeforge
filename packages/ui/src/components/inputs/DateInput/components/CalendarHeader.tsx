import { Select } from '@headlessui/react'
import dayjs from 'dayjs'
import { range } from 'lodash'

import { Button } from '@/components/inputs'
import { Box, Flex, Icon, Text } from '@/components/primitives'

import * as styles from './CalendarHeader.css'

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
      <Flex align="center" justify="between" px="md" py="sm">
        <Button
          className={styles.navButton}
          disabled={prevMonthButtonDisabled}
          icon="tabler:chevron-left"
          variant="plain"
          onClick={decreaseMonth}
        />
        <Flex align="center" gap="sm">
          <Box position="relative">
            <Box
              asChild
              className={styles.select}
              pl="sm"
              pr="xl"
              py="sm"
              r="md"
            >
              <Select
                value={dayjs(date).year()}
                onChange={({ target: { value } }) => changeYear(+value)}
              >
                {years.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
            </Box>
            <Icon className={styles.selectArrow} icon="uil:angle-down" />
          </Box>
          <Box position="relative">
            <Box
              asChild
              className={styles.select}
              display={{ base: 'none', sm: 'block' }}
              pl="sm"
              pr="xl"
              py="sm"
              r="md"
            >
              <Select
                value={months[dayjs(date).month()]}
                onChange={({ target: { value } }) =>
                  changeMonth(months.indexOf(value))
                }
              >
                {months.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
            </Box>
            <Box
              asChild
              className={styles.select}
              display={{ base: 'block', sm: 'none' }}
              pr="xl"
              py="sm"
              r="md"
              style={{ paddingLeft: '0.75rem' }}
            >
              <Select
                value={months[dayjs(date).month()]}
                onChange={({ target: { value } }) =>
                  changeMonth(months.indexOf(value))
                }
              >
                {months.map(option => (
                  <option key={option} value={option.slice(0, 3)}>
                    {option.slice(0, 3)}
                  </option>
                ))}
              </Select>
            </Box>
            <Icon className={styles.selectArrow} icon="uil:angle-down" />
          </Box>
        </Flex>
        <Button
          className={styles.navButton}
          disabled={nextMonthButtonDisabled}
          icon="tabler:chevron-right"
          variant="plain"
          onClick={increaseMonth}
        />
      </Flex>
    </Text>
  )
}
