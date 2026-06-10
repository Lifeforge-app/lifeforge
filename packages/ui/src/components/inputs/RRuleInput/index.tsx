import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Box, Flex, Text } from '@/components/primitives'

import { DateInput } from '../DateInput'
import { ListboxInput } from '../ListboxInput'
import { ListboxOption } from '../ListboxInput/components/ListboxOption'
import { NumberInput } from '../NumberInput'
import { DailyForm } from './components/DailyForm'
import { HourlyForm } from './components/HourlyForm'
import { MonthlyForm } from './components/MonthlyForm'
import { WeeklyForm } from './components/WeeklyForm'
import { YearlyForm } from './components/YearlyForm'
import { fromRRULEString, getRRULEString } from './utils/getRRuleString'

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

export function RRuleInput<HasDuration extends boolean = boolean>({
  value,
  onChange,
  hasDuration
}: {
  value: string
  onChange: (value: string) => void
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
          setRRuleParams({
            freq: 'yearly',
            data,
            end: rruleParams.end
          })
        }
      />
    ),
    monthly: (
      <MonthlyForm
        data={rruleParams.data as FreqSpecificParams['monthly']}
        setData={data =>
          setRRuleParams({
            freq: 'monthly',
            data,
            end: rruleParams.end
          })
        }
      />
    ),
    weekly: (
      <WeeklyForm
        data={rruleParams.data as FreqSpecificParams['weekly']}
        setData={data =>
          setRRuleParams({
            freq: 'weekly',
            data,
            end: rruleParams.end
          })
        }
      />
    ),
    daily: (
      <DailyForm
        data={rruleParams.data as FreqSpecificParams['daily']}
        setData={data =>
          setRRuleParams({
            freq: 'daily',
            data,
            end: rruleParams.end
          })
        }
      />
    ),
    hourly: (
      <HourlyForm
        data={rruleParams.data as FreqSpecificParams['hourly']}
        setData={data =>
          setRRuleParams({
            freq: 'hourly',
            data,
            end: rruleParams.end
          })
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

    onChange(rrule)
  }, [start, rruleParams, duration])

  return (
    <Flex direction="column" gap="md" width="100%">
      <Box mt="md">
        <DateInput
          hasTime
          required
          icon="tabler:clock"
          label="Start Time"
          namespace="apps.calendar"
          value={start}
          onChange={setStart}
        />
      </Box>
      <Box mt="md">
        <ListboxInput
          required
          icon="tabler:repeat"
          label="frequency"
          namespace="apps.calendar"
          renderContent={() => <>{t(`recurring.freqs.${rruleParams.freq}`)}</>}
          value={rruleParams.freq}
          onChange={freq => {
            setRRuleParams(createRRuleParams(freq, rruleParams.end))

            if (freq === 'hourly') {
              setDuration({
                amount: 1,
                unit: 'hour'
              })
            }
          }}
        >
          {['hourly', 'daily', 'weekly', 'monthly', 'yearly'].map(freq => (
            <ListboxOption
              key={freq}
              label={t(`recurring.freqs.${freq}`)}
              value={freq}
            />
          ))}
        </ListboxInput>
      </Box>
      <Flex direction="column" gap="md" width="100%">
        {forms[rruleParams.freq]}
      </Flex>
      <Flex align="center" gap="sm" width="100%" wrap="wrap">
        <Box flex="1">
          <ListboxInput
            required
            icon="tabler:calendar"
            label="endType"
            namespace="apps.calendar"
            renderContent={() => (
              <>{t(`recurring.endTypes.${rruleParams.end.type}`)}</>
            )}
            value={rruleParams.end.type}
            onChange={type => {
              setRRuleParams({
                ...rruleParams,
                end: {
                  ...rruleParams.end,
                  type
                }
              })
            }}
          >
            {['never', 'after', 'on'].map(type => (
              <ListboxOption
                key={type}
                label={t(`recurring.endTypes.${type}`)}
                value={type}
              />
            ))}
          </ListboxInput>
        </Box>
        {rruleParams.end.type !== 'never' && (
          <Flex align="center" flex="1" gap="md">
            {rruleParams.end.type === 'after' && (
              <>
                <Box flex="1">
                  <NumberInput
                    required
                    icon="tabler:repeat"
                    label={t('recurring.inputs.after')}
                    value={rruleParams.end.after}
                    onChange={value => {
                      setRRuleParams({
                        ...rruleParams,
                        end: {
                          ...rruleParams.end,
                          after: value
                        }
                      })
                    }}
                  />
                </Box>
                <Text color="muted">{t('recurring.inputs.executions')}</Text>
              </>
            )}
            {rruleParams.end.type === 'on' && (
              <Box flex="1">
                <DateInput
                  required
                  icon="tabler:calendar"
                  label={t('recurring.inputs.on')}
                  value={rruleParams.end.on}
                  onChange={date => {
                    setRRuleParams({
                      ...rruleParams,
                      end: {
                        ...rruleParams.end,
                        on: date
                      }
                    })
                  }}
                />
              </Box>
            )}
          </Flex>
        )}
      </Flex>
      {hasDuration && (
        <Flex
          direction={{ base: 'column', sm: 'row' }}
          gap="sm"
          width="100%"
          wrap="wrap"
        >
          <Box flex="1" minWidth="12rem">
            <NumberInput
              required
              icon="tabler:clock"
              label={t('recurring.inputs.durationAmount')}
              value={duration.amount}
              onChange={amt => {
                setDuration({
                  ...duration,
                  amount: amt
                })
              }}
            />
          </Box>
          <Box flex="1" minWidth="12rem">
            <ListboxInput
              required
              icon="tabler:clock"
              label={t('recurring.inputs.durationUnit')}
              renderContent={() => (
                <>{t(`recurring.durationUnits.${duration.unit}`)}</>
              )}
              value={duration.unit}
              onChange={unit => {
                setDuration({
                  ...duration,
                  unit
                })
              }}
            >
              {['minute', 'hour', 'day', 'week', 'month', 'year'].map(unit => (
                <ListboxOption
                  key={unit}
                  label={t(`recurring.durationUnits.${unit}`)}
                  value={unit}
                />
              ))}
            </ListboxInput>
          </Box>
        </Flex>
      )}
    </Flex>
  )
}
