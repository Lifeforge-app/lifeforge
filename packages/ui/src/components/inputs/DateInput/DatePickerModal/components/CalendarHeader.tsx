import { Button } from '@/components/inputs'
import { Flex, Text } from '@/components/primitives'
import { useModalStore } from '@/providers'

import { useDatePicker } from '../contexts/DatePickerContext'
import { YearMonthSelectorModal } from './YearMonthSelectorModal'

export function CalendarHeader() {
  const { currentYearMonth, setCurrentMonth, prevDisabled, nextDisabled } =
    useDatePicker()

  const { open } = useModalStore()

  return (
    <Flex justify="center">
      <Flex
        align="center"
        gap="sm"
        justify="between"
        maxWidth="30rem"
        pb="sm"
        px="xs"
        width="100%"
        onMouseDown={e => e.stopPropagation()}
      >
        <Button
          icon="tabler:chevron-down"
          iconPosition="end"
          p={{ base: 'none', sm: 'sm' }}
          textProps={{ size: 'lg' }}
          variant="plain"
          onClick={() =>
            open(YearMonthSelectorModal, {
              yearMonth: currentYearMonth,
              onSelect: (year, month) =>
                setCurrentMonth(prev =>
                  prev.set('year', year).set('month', month)
                )
            })
          }
        >
          {(
            [
              [{ base: 'none', sm: 'block' }, 'MMMM YYYY'],
              [{ base: 'block', sm: 'none' }, 'MMM YYYY']
            ] as const
          ).map(([display, format]) => (
            <Text
              key={format}
              color={{ base: 'bg-800', dark: 'bg-100' }}
              display={display}
            >
              {currentYearMonth.format(format)}
            </Text>
          ))}
        </Button>
        <Flex gap="sm">
          {(
            [
              [
                'tabler:chevron-left',
                () => setCurrentMonth(prev => prev.subtract(1, 'month')),
                prevDisabled
              ],
              [
                'tabler:chevron-right',
                () => setCurrentMonth(prev => prev.add(1, 'month')),
                nextDisabled
              ]
            ] as const
          ).map(([icon, onClick, disabled]) => (
            <Button
              key={icon}
              disabled={disabled}
              icon={icon}
              p={{ base: 'none', sm: 'sm' }}
              variant="plain"
              onClick={onClick}
            />
          ))}
        </Flex>
      </Flex>
    </Flex>
  )
}
