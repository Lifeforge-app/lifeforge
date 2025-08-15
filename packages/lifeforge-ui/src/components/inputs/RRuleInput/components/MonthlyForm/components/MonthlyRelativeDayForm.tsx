import ListboxInput from '@components/inputs/ListboxInput'
import ListboxOption from '@components/inputs/ListboxInput/components/ListboxOption'
import type { FreqSpecificParams } from '@components/inputs/RRuleInput'
import { useTranslation } from 'react-i18next'

function MonthlyRelativeDayForm({
  data,
  setData
}: {
  data: FreqSpecificParams['monthly']
  setData: (data: FreqSpecificParams['monthly']) => void
}) {
  const { t } = useTranslation(['apps.calendar', 'common.misc'])

  return (
    <>
      <ListboxInput
        required
        buttonContent={<>{t(`recurring.onThe.${data.onThe}`)}</>}
        className="flex-1"
        icon="tabler:calendar"
        label={t('inputs.monthly.relativeDay.inputs.onThe')}
        setValue={onThe => setData({ ...data, onThe })}
        value={data.onThe}
      >
        {['first', 'second', 'third', 'fourth', 'last'].map(day => (
          <ListboxOption
            key={day}
            label={t(`recurring.onThe.${day}`)}
            value={day}
          />
        ))}
      </ListboxInput>
      <ListboxInput
        required
        buttonContent={
          <>
            {t(
              data.onTheDay.length === 3 && data.onTheDay !== 'day'
                ? `common.misc:dates.days.${[
                    'mon',
                    'tue',
                    'wed',
                    'thu',
                    'fri',
                    'sat',
                    'sun'
                  ].indexOf(data.onTheDay)}`
                : `recurring.onTheDay.${data.onTheDay}`
            )}
          </>
        }
        className="flex-1"
        icon="tabler:calendar"
        label={t('inputs.monthly.relativeDay.inputs.onTheDay')}
        setValue={onTheDay => setData({ ...data, onTheDay })}
        value={data.onTheDay}
      >
        {[
          'mon',
          'tue',
          'wed',
          'thu',
          'fri',
          'sat',
          'sun',
          'day',
          'weekday',
          'weekendDay'
        ].map((day, idx) => (
          <ListboxOption
            key={day}
            label={t(
              idx < 7
                ? `common.misc:dates.days.${[
                    'mon',
                    'tue',
                    'wed',
                    'thu',
                    'fri',
                    'sat',
                    'sun'
                  ].indexOf(day)}`
                : `recurring.onTheDay.${day}`
            )}
            value={day}
          />
        ))}
      </ListboxInput>
    </>
  )
}

export default MonthlyRelativeDayForm
