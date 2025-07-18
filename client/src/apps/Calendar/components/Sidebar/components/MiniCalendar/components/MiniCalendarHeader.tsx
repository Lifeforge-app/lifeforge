import dayjs from 'dayjs'
import { Button } from 'lifeforge-ui'

import { usePersonalization } from 'shared/lib'

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
    <div className="flex-between mb-4 flex gap-2">
      <div className="text-lg font-semibold whitespace-nowrap">
        {dayjs()
          .year(currentYear)
          .month(currentMonth)
          .locale(language)
          .format(language.startsWith('zh') ? 'YYYY[年] MMM' : 'MMMM YYYY')}
      </div>
      <div className="-mr-4 flex gap-1">
        <Button
          className="p-2!"
          icon="tabler:chevron-left"
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
          className="p-2!"
          icon="tabler:chevron-right"
          variant="plain"
          onClick={() => {
            setCurrentMonth(currentMonth + 1)

            if (currentMonth === 11) {
              setCurrentYear(currentYear + 1)
              setCurrentMonth(0)
            }
          }}
        />
      </div>
    </div>
  )
}

export default MiniCalendarHeader
