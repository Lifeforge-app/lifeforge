import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import DateInput from '../DateInput'
import ListboxInput from '../ListboxInput'
import ListboxOption from '../ListboxInput/components/ListboxOption'
import NumberInput from '../NumberInput'
import DailyForm from './components/DailyForm'
import HourlyForm from './components/HourlyForm'
import MonthlyForm from './components/MonthlyForm'
import WeeklyForm from './components/WeeklyForm'
import YearlyForm from './components/YearlyForm'
import getRRULEString, { fromRRULEString } from './utils/getRRuleString'

type BaseParams<K extends keyof FreqSpecificParams> = {
  freq: K
  end: {
    type: 'never' | 'after' | 'on'
    after: number
    on: Date | null
  }
}

export type FreqSpecificParams = {
  hourly: {
    every: number
  }
  daily: {
    every: number
  }
  weekly: {
    every: number
    onDays: ('mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun')[]
  }
  monthly: {
    type: 'exactDate' | 'relativeDay'
    every: number
    onDate: number
    onThe: string
    onTheDay: string
  }
  yearly: {
    type: 'exactDate' | 'relativeDay'
    month: number
    date: number
    onThe: string
    onTheDay: string
    onTheDayOfMonth: number
  }
}

export type RRuleParams = {
  [K in keyof FreqSpecificParams]: BaseParams<K> & {
    data: FreqSpecificParams[K]
  }
}[keyof FreqSpecificParams]

const DEFAULT_FREQ_SPECIFIC_PARAMS: FreqSpecificParams = {
  hourly: {
    every: 1
  },
  daily: {
    every: 1
  },
  weekly: {
    every: 1,
    onDays: ['mon']
  },
  monthly: {
    type: 'exactDate',
    every: 1,
    onDate: 1,
    onThe: 'first',
    onTheDay: 'mon'
  },
  yearly: {
    type: 'exactDate',
    month: 1,
    date: 1,
    onThe: 'first',
    onTheDay: 'mon',
    onTheDayOfMonth: 1
  }
}

function createRRuleParams<K extends keyof FreqSpecificParams>(
  freq: K,
  end: RRuleParams['end'],
  data: FreqSpecificParams[K] = DEFAULT_FREQ_SPECIFIC_PARAMS[freq]
): RRuleParams {
  return {
    freq,
    end,
    data
  } as RRuleParams
}

function RRuleInput<HasDuration extends boolean = boolean>({
  value,
  setValue,
  hasDuration
}: {
  value: string
  setValue: (value: string) => void
  hasDuration: HasDuration
}) {
  const { t } = useTranslation(['apps.calendar', 'common.misc'])

  const valueParsed = useMemo(() => fromRRULEString(value), [value])

  const [start, setStart] = useState<Date | null>(
    valueParsed ? valueParsed.start : null
  )

  const [duration, setDuration] = useState<{
    amount: number
    unit: 'hour' | 'day' | 'week' | 'month' | 'year'
  }>({
    amount: valueParsed ? (valueParsed.duration?.duration_amt ?? 1) : 1,
    unit: valueParsed ? (valueParsed.duration?.duration_unit ?? 'hour') : 'hour'
  })

  const [rruleParams, setRRuleParams] = useState<RRuleParams>(
    valueParsed
      ? createRRuleParams(
          valueParsed.rrule.freq,
          valueParsed.rrule.end,
          valueParsed.rrule.data
        )
      : createRRuleParams('yearly', {
          type: 'never',
          after: 1,
          on: null
        })
  )

  const forms = {
    yearly: (
      <YearlyForm
        data={rruleParams.data as FreqSpecificParams['yearly']}
        setData={data =>
          setRRuleParams({ freq: 'yearly', data, end: rruleParams.end })
        }
      />
    ),
    monthly: (
      <MonthlyForm
        data={rruleParams.data as FreqSpecificParams['monthly']}
        setData={data =>
          setRRuleParams({ freq: 'monthly', data, end: rruleParams.end })
        }
      />
    ),
    weekly: (
      <WeeklyForm
        data={rruleParams.data as FreqSpecificParams['weekly']}
        setData={data =>
          setRRuleParams({ freq: 'weekly', data, end: rruleParams.end })
        }
      />
    ),
    daily: (
      <DailyForm
        data={rruleParams.data as FreqSpecificParams['daily']}
        setData={data =>
          setRRuleParams({ freq: 'daily', data, end: rruleParams.end })
        }
      />
    ),
    hourly: (
      <HourlyForm
        data={rruleParams.data as FreqSpecificParams['hourly']}
        setData={data =>
          setRRuleParams({ freq: 'hourly', data, end: rruleParams.end })
        }
      />
    )
  }

  useEffect(() => {
    let rrule = getRRULEString({
      start,
      params: rruleParams
    })

    if (hasDuration) {
      rrule += `||duration_amt=${duration.amount};duration_unit=${duration.unit}`
    }

    setValue(rrule)
  }, [start, rruleParams])

  return (
    <div className="space-y-3">
      <DateInput
        hasTime
        required
        className="mt-4"
        icon="tabler:clock"
        label="Start Time"
        namespace="apps.calendar"
        setValue={setStart}
        value={start}
      />
      <ListboxInput
        required
        buttonContent={<>{t(`recurring.freqs.${rruleParams.freq}`)}</>}
        className="mt-4"
        icon="tabler:repeat"
        label="frequency"
        namespace="apps.calendar"
        setValue={freq => {
          setRRuleParams(createRRuleParams(freq, rruleParams.end))

          if (freq === 'hourly') {
            setDuration({
              amount: 1,
              unit: 'hour'
            })
          }
        }}
        value={rruleParams.freq}
      >
        {['hourly', 'daily', 'weekly', 'monthly', 'yearly'].map(freq => (
          <ListboxOption
            key={freq}
            label={t(`recurring.freqs.${freq}`)}
            value={freq}
          />
        ))}
      </ListboxInput>
      <div className="space-y-3">{forms[rruleParams.freq]}</div>
      <div className="flex w-full flex-wrap items-center gap-2">
        <ListboxInput
          required
          buttonContent={<>{t(`recurring.endTypes.${rruleParams.end.type}`)}</>}
          className="flex-1"
          icon="tabler:calendar"
          label="endType"
          namespace="apps.calendar"
          setValue={type => {
            setRRuleParams({
              ...rruleParams,
              end: {
                ...rruleParams.end,
                type
              }
            })
          }}
          value={rruleParams.end.type}
        >
          {['never', 'after', 'on'].map(type => (
            <ListboxOption
              key={type}
              label={t(`recurring.endTypes.${type}`)}
              value={type}
            />
          ))}
        </ListboxInput>
        {rruleParams.end.type !== 'never' && (
          <div className="flex flex-1 items-center gap-3">
            {rruleParams.end.type === 'after' && (
              <>
                <NumberInput
                  required
                  className="flex-1"
                  icon="tabler:repeat"
                  label={t('recurring.inputs.after')}
                  setValue={value => {
                    setRRuleParams({
                      ...rruleParams,
                      end: {
                        ...rruleParams.end,
                        after: value
                      }
                    })
                  }}
                  value={rruleParams.end.after}
                />
                <p className="text-bg-500">
                  {t('recurring.inputs.executions')}
                </p>
              </>
            )}
            {rruleParams.end.type === 'on' && (
              <DateInput
                required
                className="flex-1"
                icon="tabler:calendar"
                label={t('recurring.inputs.on')}
                setValue={date => {
                  setRRuleParams({
                    ...rruleParams,
                    end: {
                      ...rruleParams.end,
                      on: date
                    }
                  })
                }}
                value={rruleParams.end.on}
              />
            )}
          </div>
        )}
      </div>
      {hasDuration && (
        <div className="flex flex-wrap items-center gap-2">
          <NumberInput
            required
            className="flex-1"
            icon="tabler:clock"
            label={t('recurring.inputs.durationAmount')}
            setValue={amt => {
              setDuration({
                ...duration,
                amount: amt
              })
            }}
            value={duration.amount}
          />
          <ListboxInput
            required
            buttonContent={<>{t(`recurring.durationUnits.${duration.unit}`)}</>}
            className="flex-1"
            icon="tabler:clock"
            label={t('recurring.inputs.durationUnit')}
            setValue={unit => {
              setDuration({
                ...duration,
                unit
              })
            }}
            value={duration.unit}
          >
            {['minute', 'hour', 'day', 'week', 'month', 'year'].map(unit => (
              <ListboxOption
                key={unit}
                label={t(`recurring.durationUnits.${unit}`)}
                value={unit}
              />
            ))}
          </ListboxInput>
        </div>
      )}
    </div>
  )
}

export default RRuleInput
