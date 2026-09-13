import dayjs from 'dayjs'

import { Button, Flex, Text, usePersonalization } from '@lifeforge/ui'

function MiniCalendarHeader({
  currentMonth,
  setCurrentMonth,
  currentYear,
  setCurrentYear
}: {
  currentMonth: number
  setCurrentMonth: React.Dispatch<React.SetStateAction<number>>
  currentYear: number
  setCurrentYear: React.Dispatch<React.SetStateAction<number>>
}) {
  const { language } = usePersonalization()

  return (
    <Flex justify="between" mb="md">
      <Text size="lg" weight="semibold" whiteSpace="nowrap">
        {dayjs()
          .year(currentYear)
          .month(currentMonth)
          .locale(language)
          .format(language.startsWith('zh') ? 'YYYY[年] MMM' : 'MMMM YYYY')}
      </Text>
      <Flex gap="xs">
        <Button
          icon="tabler:chevron-left"
          p="sm"
          variant="plain"
          onClick={() => {
            setCurrentMonth(currentMonth - 1)

            if (currentMonth === 0) {
              setCurrentYear(currentYear - 1)
              setCurrentMonth(11)
            }
          }}
        />
        <Button
          icon="tabler:chevron-right"
          p="sm"
          variant="plain"
          onClick={() => {
            setCurrentMonth(currentMonth + 1)

            if (currentMonth === 11) {
              setCurrentYear(currentYear + 1)
              setCurrentMonth(0)
            }
          }}
        />
      </Flex>
    </Flex>
  )
}

export default MiniCalendarHeader
