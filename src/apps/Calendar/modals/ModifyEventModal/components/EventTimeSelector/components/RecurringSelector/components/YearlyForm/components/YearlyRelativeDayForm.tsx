import { useTranslation } from 'react-i18next'

import { ListboxOrComboboxInput, ListboxOrComboboxOption } from '@lifeforge/ui'

function YearlyRelativeDayForm({
  yearlyOnThe,
  yearlyOnTheDay,
  yearlyOnTheDayOfMonth,
  setYearlyOnThe,
  setYearlyOnTheDay,
  setYearlyOnTheDayOfMonth
}: {
  yearlyOnThe: string
  yearlyOnTheDay: string
  yearlyOnTheDayOfMonth: number
  setYearlyOnThe: React.Dispatch<React.SetStateAction<string>>
  setYearlyOnTheDay: React.Dispatch<React.SetStateAction<string>>
  setYearlyOnTheDayOfMonth: React.Dispatch<React.SetStateAction<number>>
}) {
  const { t } = useTranslation(['apps.calendar', 'common.misc'])

  return (
    <>
      <ListboxOrComboboxInput
        required
        buttonContent={<>{t(`recurring.onThe.${yearlyOnThe}`)}</>}
        className="flex-1"
        icon="tabler:calendar"
        name={t('inputs.yearly.relativeDay.inputs.onThe')}
        namespace={false}
        setValue={setYearlyOnThe}
        type="listbox"
        value={yearlyOnThe}
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
              yearlyOnTheDay.length === 3 && yearlyOnTheDay !== 'day'
                ? `common.misc:dates.days.${[
                    'mon',
                    'tue',
                    'wed',
                    'thu',
                    'fri',
                    'sat',
                    'sun'
                  ].indexOf(yearlyOnTheDay)}`
                : `recurring.onTheDay.${yearlyOnTheDay}`
            )}
          </>
        }
        className="flex-1"
        icon="tabler:calendar"
        name={t('inputs.yearly.relativeDay.inputs.onTheDay')}
        namespace={false}
        setValue={setYearlyOnTheDay}
        type="listbox"
        value={yearlyOnTheDay}
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
      <ListboxOrComboboxInput
        required
        buttonContent={
          <>{t(`common.misc:dates.months.${yearlyOnTheDayOfMonth}`)}</>
        }
        className="flex-1"
        icon="tabler:calendar"
        name={t('inputs.yearly.relativeDay.inputs.ofTheMonth')}
        namespace={false}
        setValue={setYearlyOnTheDayOfMonth}
        type="listbox"
        value={yearlyOnTheDayOfMonth}
      >
        {Array(12)
          .fill(0)
          .map((_, month) => (
            <ListboxOrComboboxOption
              key={month}
              text={t(`common.misc:dates.months.${month}`)}
              value={month}
            />
          ))}
      </ListboxOrComboboxInput>
    </>
  )
}

export default YearlyRelativeDayForm
