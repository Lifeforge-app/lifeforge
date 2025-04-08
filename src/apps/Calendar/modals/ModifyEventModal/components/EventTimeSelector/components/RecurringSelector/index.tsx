import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  DateInput,
  ListboxOrComboboxInput,
  ListboxOrComboboxOption,
  TextInput
} from '@lifeforge/ui'

import DailyForm from './components/DailyForm'
import HourlyForm from './components/HourlyForm'
import MonthlyForm from './components/MonthlyForm'
import WeeklyForm from './components/WeeklyForm'
import YearlyForm from './components/YearlyForm'

function RecurringSelector() {
  const { t } = useTranslation(['apps.calendar', 'common.misc'])

  const [freq, setFreq] = useState<
    'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly'
  >('yearly')

  const [yearlyMonth, setYearlyMonth] = useState(0)
  const [yearlyDate, setYearlyDate] = useState<string>('1')
  const [yearlyOnThe, setYearlyOnThe] = useState<string>('first')
  const [yearlyOnTheDay, setYearlyOnTheDay] = useState<string>('mon')
  const [yearlyOnTheDayOfMonth, setYearlyOnTheDayOfMonth] = useState(0)

  const [monthlyEvery, setMonthlyEvery] = useState('1')
  const [monthlyOnDate, setMonthlyOnDate] = useState('1')
  const [monthlyOnThe, setMonthlyOnThe] = useState<string>('first')
  const [monthlyOnTheDay, setMonthlyOnTheDay] = useState<string>('mon')

  const [weeklyEvery, setWeeklyEvery] = useState('1')
  const [weeklyOn, setWeeklyOn] = useState<
    ('mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun')[]
  >([])

  const [dailyEvery, setDailyEvery] = useState('1')

  const [hourlyEvery, setHourlyEvery] = useState('1')

  const [endType, setEndType] = useState<'never' | 'after' | 'on'>('never')
  const [endAfter, setEndAfter] = useState('1')
  const [endOn, setEndOn] = useState<string>('')

  const forms = {
    yearly: (
      <YearlyForm
        setYearlyDate={setYearlyDate}
        setYearlyMonth={setYearlyMonth}
        setYearlyOnThe={setYearlyOnThe}
        setYearlyOnTheDay={setYearlyOnTheDay}
        setYearlyOnTheDayOfMonth={setYearlyOnTheDayOfMonth}
        yearlyDate={yearlyDate}
        yearlyMonth={yearlyMonth}
        yearlyOnThe={yearlyOnThe}
        yearlyOnTheDay={yearlyOnTheDay}
        yearlyOnTheDayOfMonth={yearlyOnTheDayOfMonth}
      />
    ),
    monthly: (
      <MonthlyForm
        monthlyEvery={monthlyEvery}
        monthlyOnDate={monthlyOnDate}
        monthlyOnThe={monthlyOnThe}
        monthlyOnTheDay={monthlyOnTheDay}
        setMonthlyEvery={setMonthlyEvery}
        setMonthlyOnDate={setMonthlyOnDate}
        setMonthlyOnThe={setMonthlyOnThe}
        setMonthlyOnTheDay={setMonthlyOnTheDay}
      />
    ),
    weekly: (
      <WeeklyForm
        setWeeklyEvery={setWeeklyEvery}
        setWeeklyOn={setWeeklyOn}
        weeklyEvery={weeklyEvery}
        weeklyOn={weeklyOn}
      />
    ),
    daily: <DailyForm dailyEvery={dailyEvery} setDailyEvery={setDailyEvery} />,
    hourly: (
      <HourlyForm hourlyEvery={hourlyEvery} setHourlyEvery={setHourlyEvery} />
    )
  }

  return (
    <>
      <ListboxOrComboboxInput
        required
        buttonContent={<>{t(`recurring.freqs.${freq}`)}</>}
        className="mt-4"
        icon="tabler:repeat"
        name="frequency"
        namespace="apps.calendar"
        setValue={setFreq}
        type="listbox"
        value={freq}
      >
        {['hourly', 'daily', 'weekly', 'monthly', 'yearly'].map(freq => (
          <ListboxOrComboboxOption
            key={freq}
            text={t(`recurring.freqs.${freq}`)}
            value={freq}
          />
        ))}
      </ListboxOrComboboxInput>
      <div className="mt-4 space-y-4">
        {forms[freq as 'monthly' | 'yearly']}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <ListboxOrComboboxInput
          required
          buttonContent={<>{t(`recurring.endTypes.${endType}`)}</>}
          className="flex-1"
          icon="tabler:calendar"
          name="endType"
          namespace="apps.calendar"
          setValue={setEndType}
          type="listbox"
          value={endType}
        >
          {['never', 'after', 'on'].map(type => (
            <ListboxOrComboboxOption
              key={type}
              text={t(`recurring.endTypes.${type}`)}
              value={type}
            />
          ))}
        </ListboxOrComboboxInput>
        {endType !== 'never' && (
          <div className="flex flex-1 items-center gap-4">
            {endType === 'after' && (
              <>
                <TextInput
                  darker
                  required
                  className="flex-1"
                  icon="tabler:repeat"
                  name={t('recurring.inputs.after')}
                  namespace={false}
                  placeholder="1"
                  setValue={setEndAfter}
                  value={endAfter}
                />
                <p className="text-bg-500">
                  {t('recurring.inputs.executions')}
                </p>
              </>
            )}
            {endType === 'on' && (
              <DateInput
                darker
                required
                className="flex-1"
                date={endOn}
                hasMargin={false}
                icon="tabler:calendar"
                name={t('recurring.inputs.on')}
                namespace={false}
                setDate={setEndOn}
              />
            )}
          </div>
        )}
      </div>
    </>
  )
}

export default RecurringSelector
