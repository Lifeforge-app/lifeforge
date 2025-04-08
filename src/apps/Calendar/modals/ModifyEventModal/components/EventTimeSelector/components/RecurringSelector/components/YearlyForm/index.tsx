import React, { useMemo, useState } from 'react'

import SelectableFormWrapper from '../SelectableFormWrapper'
import YearlyExactDateForm from './components/YearlyExactDateForm'
import YearlyRelativeDayForm from './components/YearlyRelativeDayForm'

function YearlyForm({
  setYearlyDate,
  setYearlyMonth,
  yearlyDate,
  yearlyMonth,
  setYearlyOnThe,
  setYearlyOnTheDay,
  setYearlyOnTheDayOfMonth,
  yearlyOnThe,
  yearlyOnTheDay,
  yearlyOnTheDayOfMonth
}: {
  setYearlyDate: React.Dispatch<React.SetStateAction<string>>
  setYearlyMonth: React.Dispatch<React.SetStateAction<number>>
  yearlyDate: string
  yearlyMonth: number
  setYearlyOnThe: React.Dispatch<React.SetStateAction<string>>
  setYearlyOnTheDay: React.Dispatch<React.SetStateAction<string>>
  setYearlyOnTheDayOfMonth: React.Dispatch<React.SetStateAction<number>>
  yearlyOnThe: string
  yearlyOnTheDay: string
  yearlyOnTheDayOfMonth: number
}) {
  const [yearlyType, setYearlyType] = useState<'exactDate' | 'relativeDay'>(
    'exactDate'
  )

  const memoizedYearlyExactDateForm = useMemo(
    () => (
      <YearlyExactDateForm
        setYearlyDate={setYearlyDate}
        setYearlyMonth={setYearlyMonth}
        yearlyDate={yearlyDate}
        yearlyMonth={yearlyMonth}
      />
    ),
    [yearlyMonth, yearlyDate]
  )

  const memoizedYearlyRelativeDayForm = useMemo(
    () => (
      <YearlyRelativeDayForm
        setYearlyOnThe={setYearlyOnThe}
        setYearlyOnTheDay={setYearlyOnTheDay}
        setYearlyOnTheDayOfMonth={setYearlyOnTheDayOfMonth}
        yearlyOnThe={yearlyOnThe}
        yearlyOnTheDay={yearlyOnTheDay}
        yearlyOnTheDayOfMonth={yearlyOnTheDayOfMonth}
      />
    ),
    [yearlyOnThe, yearlyOnTheDay, yearlyOnTheDayOfMonth]
  )

  const forms = [
    {
      id: 'exactDate',
      icon: 'tabler:calendar',
      component: memoizedYearlyExactDateForm
    },
    {
      id: 'relativeDay',
      icon: 'tabler:repeat',
      component: memoizedYearlyRelativeDayForm
    }
  ]

  return (
    <>
      {forms.map(form => (
        <SelectableFormWrapper
          key={form.id}
          formId={`yearly.${form.id}`}
          selected={yearlyType === form.id}
          onSelect={() => {
            setYearlyType(form.id as 'exactDate' | 'relativeDay')
          }}
        >
          {form.component}
        </SelectableFormWrapper>
      ))}
    </>
  )
}

export default YearlyForm
