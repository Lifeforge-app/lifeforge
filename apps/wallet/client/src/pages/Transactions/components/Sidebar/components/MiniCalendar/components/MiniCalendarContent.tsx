import { useWalletData } from '@/hooks/useWalletData'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'
import { usePersonalization } from 'shared'

import MiniCalendarDateItem from './MiniCalendarDateItem'
import useTransactionCountMap from './MiniCalendarDateItem/hooks/useTransactionCountMap'

function MiniCalendarContent({
  currentMonth,
  currentYear,
  viewsFilter
}: {
  currentMonth: number
  currentYear: number
  viewsFilter: ('income' | 'expenses' | 'transfer')[]
}) {
  const { language } = usePersonalization()

  const { transactionsQuery } = useWalletData()

  const [nextToSelect, setNextToSelect] = useState<'start' | 'end'>('start')

  const transactions = transactionsQuery.data ?? []

  const firstDateOfMonth = useMemo(
    () => dayjs(`${currentYear}-${currentMonth + 1}-01`, 'YYYY-M-DD').toDate(),
    [currentMonth, currentYear]
  )

  const transactionCountMap = useTransactionCountMap({
    transactions,
    currentMonth,
    currentYear,
    viewsFilter
  })

  return (
    <div className="grid grid-cols-7 gap-y-2">
      {{
        en: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        'zh-CN': ['一', '二', '三', '四', '五', '六', '日'],
        'zh-TW': ['一', '二', '三', '四', '五', '六', '日'],
        ms: ['Is', 'Se', 'Ra', 'Kh', 'Ju', 'Sa', 'Ah']
      }[language ?? 'en']?.map(day => (
        <div key={day} className="flex-center text-bg-500 text-sm">
          {day}
        </div>
      ))}
      {Array(
        Math.ceil(
          (dayjs().year(currentYear).month(currentMonth).daysInMonth() +
            dayjs()
              .year(currentYear)
              .month(currentMonth - 1)
              .endOf('month')
              .day()) /
            7
        ) * 7
      )
        .fill(0)
        .map((_, index) => (
          <MiniCalendarDateItem
            key={index}
            date={firstDateOfMonth}
            index={index}
            nextToSelect={nextToSelect}
            setNextToSelect={setNextToSelect}
            transactionCountMap={transactionCountMap}
          />
        ))}
    </div>
  )
}

export default MiniCalendarContent
