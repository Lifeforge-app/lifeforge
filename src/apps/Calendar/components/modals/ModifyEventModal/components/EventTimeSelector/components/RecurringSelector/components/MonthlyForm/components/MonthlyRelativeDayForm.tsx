import { useTranslation } from 'react-i18next'

import { ListboxOrComboboxInput, ListboxOrComboboxOption } from '@lifeforge/ui'

function MonthlyRelativeDayForm({
  monthlyOnThe,
  monthlyOnTheDay,
  setMonthlyOnThe,
  setMonthlyOnTheDay
}: {
  monthlyOnThe: string
  monthlyOnTheDay: string
  setMonthlyOnThe: React.Dispatch<React.SetStateAction<string>>
  setMonthlyOnTheDay: React.Dispatch<React.SetStateAction<string>>
}) {
  const { t } = useTranslation(['apps.calendar', 'common.misc'])

  return (
    <>
      <ListboxOrComboboxInput
        required
        buttonContent={<>{t(`recurring.onThe.${monthlyOnThe}`)}</>}
        className="flex-1"
        icon="tabler:calendar"
        name={t('inputs.monthly.relativeDay.inputs.onThe')}
        namespace={false}
        setValue={setMonthlyOnThe}
        type="listbox"
        value={monthlyOnThe}
      >
        {['first', 'second', 'third', 'fourth', 'last'].map(day => (
          <ListboxOrComboboxOption
            key={day}
            text={t(`recurring.onThe.${day}`)}
            value={day}
          />
        ))}
      </ListboxOrComboboxInput>
      <ListboxOrComboboxInput
        required
        buttonContent={
          <>
            {t(
              monthlyOnTheDay.length === 3 && monthlyOnTheDay !== 'day'
                ? `common.misc:dates.days.${[
                    'mon',
                    'tue',
                    'wed',
                    'thu',
                    'fri',
                    'sat',
                    'sun'
                  ].indexOf(monthlyOnTheDay)}`
                : `recurring.onTheDay.${monthlyOnTheDay}`
            )}
          </>
        }
        className="flex-1"
        icon="tabler:calendar"
        name={t('inputs.monthly.relativeDay.inputs.onTheDay')}
        namespace={false}
        setValue={setMonthlyOnTheDay}
        type="listbox"
        value={monthlyOnTheDay}
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
          <ListboxOrComboboxOption
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
      </ListboxOrComboboxInput>
    </>
  )
}

export default MonthlyRelativeDayForm
