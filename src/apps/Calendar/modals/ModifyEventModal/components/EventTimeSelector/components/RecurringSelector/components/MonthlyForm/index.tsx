import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { TextInput } from '@lifeforge/ui'

import SelectableFormWrapper from '../SelectableFormWrapper'
import MonthlyExactDateForm from './components/MonthlyExactDateForm'
import MonthlyRelativeDayForm from './components/MonthlyRelativeDayForm'

function MonthlyForm({
  monthlyType,
  monthlyEvery,
  monthlyOnDate,
  monthlyOnThe,
  monthlyOnTheDay,
  setMonthlyType,
  setMonthlyEvery,
  setMonthlyOnDate,
  setMonthlyOnThe,
  setMonthlyOnTheDay
}: {
  monthlyType: 'exactDate' | 'relativeDay'
  monthlyEvery: string
  monthlyOnDate: string
  monthlyOnThe: string
  monthlyOnTheDay: string
  setMonthlyType: React.Dispatch<
    React.SetStateAction<'exactDate' | 'relativeDay'>
  >
  setMonthlyEvery: React.Dispatch<React.SetStateAction<string>>
  setMonthlyOnDate: React.Dispatch<React.SetStateAction<string>>
  setMonthlyOnThe: React.Dispatch<React.SetStateAction<string>>
  setMonthlyOnTheDay: React.Dispatch<React.SetStateAction<string>>
}) {
  const { t } = useTranslation(['apps.calendar', 'common.misc'])

  const memoizedMonthlyExactDateForm = useMemo(
    () => (
      <MonthlyExactDateForm
        monthlyOnDate={monthlyOnDate}
        setMonthlyOnDate={setMonthlyOnDate}
      />
    ),
    [monthlyOnDate]
  )

  const memoizedMonthlyRelativeDayForm = useMemo(
    () => (
      <MonthlyRelativeDayForm
        monthlyOnThe={monthlyOnThe}
        monthlyOnTheDay={monthlyOnTheDay}
        setMonthlyOnThe={setMonthlyOnThe}
        setMonthlyOnTheDay={setMonthlyOnTheDay}
      />
    ),
    [monthlyOnThe, monthlyOnTheDay]
  )

  const forms = [
    {
      id: 'exactDate',
      icon: 'tabler:calendar',
      component: memoizedMonthlyExactDateForm
    },
    {
      id: 'relativeDay',
      icon: 'tabler:calendar',
      component: memoizedMonthlyRelativeDayForm
    }
  ]

  return (
    <>
      <div className="flex w-full items-center gap-4">
        <TextInput
          darker
          className="flex-1"
          icon="tabler:repeat"
          name={t('inputs.monthly.inputs.every')}
          namespace={false}
          placeholder={t('inputs.number')}
          setValue={setMonthlyEvery}
          value={monthlyEvery}
        />
        <p className="text-bg-500">{t('inputs.monthly.inputs.months')}</p>
      </div>
      {forms.map(form => (
        <SelectableFormWrapper
          key={form.id}
          formId={`monthly.${form.id}`}
          selected={monthlyType === form.id}
          onSelect={() => {
            setMonthlyType(form.id as 'exactDate' | 'relativeDay')
          }}
        >
          {form.component}
        </SelectableFormWrapper>
      ))}
    </>
  )
}

export default MonthlyForm
