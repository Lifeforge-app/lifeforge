import {
  DateInput,
  ListboxOrComboboxInput,
  ListboxOrComboboxOption,
  TextInput
} from 'lifeforge-ui'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ICalendarEventFormState } from '@apps/Calendar/interfaces/calendar_interfaces'

import DailyForm from './components/DailyForm'
import HourlyForm from './components/HourlyForm'
import MonthlyForm from './components/MonthlyForm'
import WeeklyForm from './components/WeeklyForm'
import YearlyForm from './components/YearlyForm'
import getRRULEString from './utils/getRRuleString'

function RecurringSelector({
  formState,
  setFormState
}: {
  formState: ICalendarEventFormState
  setFormState: React.Dispatch<React.SetStateAction<ICalendarEventFormState>>
}) {
  const { t } = useTranslation(['apps.calendar', 'common.misc'])

  const [freq, setFreq] = useState<
    'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly'
  >('yearly')

  const [yearlyType, setYearlyType] = useState<'exactDate' | 'relativeDay'>(
    'exactDate'
  )

  const [monthlyType, setMonthlyType] = useState<'exactDate' | 'relativeDay'>(
    'exactDate'
  )

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

  const [endOn, setEndOn] = useState<Date | null>(null)

  const forms = {
    yearly: (
      <YearlyForm
        setYearlyDate={setYearlyDate}
        setYearlyMonth={setYearlyMonth}
        setYearlyOnThe={setYearlyOnThe}
        setYearlyOnTheDay={setYearlyOnTheDay}
        setYearlyOnTheDayOfMonth={setYearlyOnTheDayOfMonth}
        setYearlyType={setYearlyType}
        yearlyDate={yearlyDate}
        yearlyMonth={yearlyMonth}
        yearlyOnThe={yearlyOnThe}
        yearlyOnTheDay={yearlyOnTheDay}
        yearlyOnTheDayOfMonth={yearlyOnTheDayOfMonth}
        yearlyType={yearlyType}
      />
    ),
    monthly: (
      <MonthlyForm
        monthlyEvery={monthlyEvery}
        monthlyOnDate={monthlyOnDate}
        monthlyOnThe={monthlyOnThe}
        monthlyOnTheDay={monthlyOnTheDay}
        monthlyType={monthlyType}
        setMonthlyEvery={setMonthlyEvery}
        setMonthlyOnDate={setMonthlyOnDate}
        setMonthlyOnThe={setMonthlyOnThe}
        setMonthlyOnTheDay={setMonthlyOnTheDay}
        setMonthlyType={setMonthlyType}
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

  useEffect(() => {
    if (!formState.start) {
      return
    }

    const rrule = getRRULEString({
      start: formState.start,
      freq,
      yearlyType,
      yearlyMonth,
      yearlyDate,
      yearlyOnThe,
      yearlyOnTheDay,
      yearlyOnTheDayOfMonth,
      monthlyEvery,
      monthlyType,
      monthlyOnDate,
      monthlyOnThe,
      monthlyOnTheDay,
      weeklyEvery,
      weeklyOn,
      dailyEvery,
      hourlyEvery,
      endType,
      endAfter,
      endOn
    })

    setFormState({
      ...formState,
      recurring_rrule: rrule
    })
  }, [
    formState.start,
    freq,
    yearlyType,
    yearlyMonth,
    yearlyDate,
    yearlyOnThe,
    yearlyOnTheDay,
    yearlyOnTheDayOfMonth,
    monthlyEvery,
    monthlyType,
    monthlyOnDate,
    monthlyOnThe,
    monthlyOnTheDay,
    weeklyEvery,
    weeklyOn,
    dailyEvery,
    hourlyEvery,
    endType,
    endAfter,
    endOn
  ])

  return (
    <>
      <DateInput
        darker
        hasTime
        required
        className="mt-4"
        date={formState.start}
        icon="tabler:clock"
        name="Start Time"
        namespace="apps.calendar"
        setDate={date => {
          setFormState({
            ...formState,
            start: date
          })
        }}
      />
      <ListboxOrComboboxInput
        required
        buttonContent={<>{t(`recurring.freqs.${freq}`)}</>}
        className="mt-4"
        icon="tabler:repeat"
        name="frequency"
        namespace="apps.calendar"
        setValue={(value: string) => {
          setFreq(value as any)

          if (value === 'hourly') {
            setFormState({
              ...formState,
              recurring_duration_amount: '1',
              recurring_duration_unit: 'hour'
            })
          }
        }}
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
          <div className="flex flex-1 items-center gap-3">
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
                className="mt-0! flex-1"
                date={endOn}
                icon="tabler:calendar"
                name={t('recurring.inputs.on')}
                namespace={false}
                setDate={setEndOn}
              />
            )}
          </div>
        )}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <TextInput
          darker
          className="flex-1"
          icon="tabler:clock"
          inputMode="numeric"
          name={t('recurring.inputs.durationAmount')}
          namespace={false}
          placeholder="1"
          setValue={(value: string) => {
            setFormState({
              ...formState,
              recurring_duration_amount: value
            })
          }}
          value={formState.recurring_duration_amount}
        />
        <ListboxOrComboboxInput
          required
          buttonContent={
            <>
              {t(
                `recurring.durationUnits.${formState.recurring_duration_unit}`
              )}
            </>
          }
          className="flex-1"
          icon="tabler:clock"
          name={t('recurring.inputs.durationUnit')}
          namespace={false}
          setValue={(value: string) => {
            setFormState({
              ...formState,
              recurring_duration_unit: value
            })
          }}
          type="listbox"
          value={formState.recurring_duration_unit}
        >
          {['minute', 'hour', 'day', 'week', 'month', 'year'].map(unit => (
            <ListboxOrComboboxOption
              key={unit}
              text={t(`recurring.durationUnits.${unit}`)}
              value={unit}
            />
          ))}
        </ListboxOrComboboxInput>
      </div>
    </>
  )
}

export default RecurringSelector
