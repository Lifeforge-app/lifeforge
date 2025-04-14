import React, { useMemo } from 'react'

import SelectableFormWrapper from '../SelectableFormWrapper'
import YearlyExactDateForm from './components/YearlyExactDateForm'
import YearlyRelativeDayForm from './components/YearlyRelativeDayForm'

function YearlyForm({
  yearlyType,
  yearlyDate,
  yearlyMonth,
  yearlyOnThe,
  yearlyOnTheDay,
  yearlyOnTheDayOfMonth,
  setYearlyType,
  setYearlyOnThe,
  setYearlyOnTheDay,
  setYearlyOnTheDayOfMonth,
  setYearlyDate,
  setYearlyMonth
}: {
  yearlyType: 'exactDate' | 'relativeDay'
  yearlyDate: string
  yearlyMonth: number
  yearlyOnThe: string
  yearlyOnTheDay: string
  yearlyOnTheDayOfMonth: number
  setYearlyType: React.Dispatch<
    React.SetStateAction<'exactDate' | 'relativeDay'>
  >
  setYearlyDate: React.Dispatch<React.SetStateAction<string>>
  setYearlyMonth: React.Dispatch<React.SetStateAction<number>>
  setYearlyOnThe: React.Dispatch<React.SetStateAction<string>>
  setYearlyOnTheDay: React.Dispatch<React.SetStateAction<string>>
  setYearlyOnTheDayOfMonth: React.Dispatch<React.SetStateAction<number>>
}) {
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
