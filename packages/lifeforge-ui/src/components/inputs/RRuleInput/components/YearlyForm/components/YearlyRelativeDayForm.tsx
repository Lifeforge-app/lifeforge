import { useTranslation } from 'react-i18next'

import { ListboxInput, ListboxOption } from '@components/inputs'
import type { FreqSpecificParams } from '@components/inputs/RRuleInput/RRuleInput'
import { Box } from '@components/primitives'

const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const

function YearlyRelativeDayForm({
  data,
  setData
}: {
  data: FreqSpecificParams['yearly']
  setData: (data: FreqSpecificParams['yearly']) => void
}) {
  const { t } = useTranslation(['apps.calendar', 'common.misc'])

  return (
    <>
      <Box asChild flex="1" minWidth="6em">
        <ListboxInput
          required
          buttonContent={<>{t(`recurring.onThe.${data.onThe}`)}</>}
          icon="tabler:calendar"
          label={t('inputs.yearly.relativeDay.inputs.onThe')}
          value={data.onThe}
          onChange={value => setData({ ...data, onThe: value })}
        >
          {['first', 'second', 'third', 'fourth', 'last'].map(day => (
            <ListboxOption
              key={day}
              label={t(`recurring.onThe.${day}`)}
              value={day}
            />
          ))}
        </ListboxInput>
      </Box>
      <Box asChild flex="1" minWidth="6em">
        <ListboxInput
          required
          buttonContent={
            <>
              {t(
                data.onTheDay.length === 3 && data.onTheDay !== 'day'
                  ? `common.misc:dates.days.${DAYS.indexOf(data.onTheDay as (typeof DAYS)[number])}`
                  : `recurring.onTheDay.${data.onTheDay}`
              )}
            </>
          }
          icon="tabler:calendar"
          label={t('inputs.yearly.relativeDay.inputs.onTheDay')}
          value={data.onTheDay}
          onChange={value => setData({ ...data, onTheDay: value })}
        >
          {[...DAYS, 'day', 'weekday', 'weekendDay'].map((day, idx) => (
            <ListboxOption
              key={day}
              label={t(
                idx < 7
                  ? `common.misc:dates.days.${DAYS.indexOf(day as (typeof DAYS)[number])}`
                  : `recurring.onTheDay.${day}`
              )}
              value={day}
            />
          ))}
        </ListboxInput>
      </Box>
      <Box asChild flex="1" minWidth="10em">
        <ListboxInput
          required
          buttonContent={
            <>{t(`common.misc:dates.months.${data.onTheDayOfMonth - 1}`)}</>
          }
          icon="tabler:calendar"
          label={t('inputs.yearly.relativeDay.inputs.ofTheMonth')}
          value={data.onTheDayOfMonth}
          onChange={value => setData({ ...data, onTheDayOfMonth: value })}
        >
          {Array(12)
            .fill(0)
            .map((_, month) => (
              <ListboxOption
                key={month}
                label={t(`common.misc:dates.months.${month}`)}
                value={month + 1}
              />
            ))}
        </ListboxInput>
      </Box>
    </>
  )
}

export default YearlyRelativeDayForm
