import ListboxInput from '@components/inputs/ListboxInput'
import ListboxOption from '@components/inputs/ListboxInput/components/ListboxOption'
import type { FreqSpecificParams } from '@components/inputs/RRuleInput'
import { useTranslation } from 'react-i18next'

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
      <ListboxInput
        required
        buttonContent={<>{t(`recurring.onThe.${data.onThe}`)}</>}
        className="flex-1"
        icon="tabler:calendar"
        label={t('inputs.yearly.relativeDay.inputs.onThe')}
        namespace={false}
        setValue={value => setData({ ...data, onThe: value })}
        value={data.onThe}
      >
        {['first', 'second', 'third', 'fourth', 'last'].map(day => (
          <ListboxOption
            key={day}
            text={t(`recurring.onThe.${day}`)}
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
        label={t('inputs.yearly.relativeDay.inputs.onTheDay')}
        namespace={false}
        setValue={value => setData({ ...data, onTheDay: value })}
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
            text={t(
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
      <ListboxInput
        required
        buttonContent={
          <>{t(`common.misc:dates.months.${data.onTheDayOfMonth - 1}`)}</>
        }
        className="flex-1"
        icon="tabler:calendar"
        label={t('inputs.yearly.relativeDay.inputs.ofTheMonth')}
        namespace={false}
        setValue={value => setData({ ...data, onTheDayOfMonth: value })}
        value={data.onTheDayOfMonth}
      >
        {Array(12)
          .fill(0)
          .map((_, month) => (
            <ListboxOption
              key={month}
              text={t(`common.misc:dates.months.${month}`)}
              value={month + 1}
            />
          ))}
      </ListboxInput>
    </>
  )
}

export default YearlyRelativeDayForm
