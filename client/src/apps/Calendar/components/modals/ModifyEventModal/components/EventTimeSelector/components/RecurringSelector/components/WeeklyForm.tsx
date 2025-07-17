import {
  ListboxOrComboboxInput,
  ListboxOrComboboxOption,
  TextInput
} from 'lifeforge-ui'
import React from 'react'
import { useTranslation } from 'react-i18next'

function WeeklyForm({
  weeklyEvery,
  weeklyOn,
  setWeeklyEvery,
  setWeeklyOn
}: {
  weeklyEvery: string
  weeklyOn: ('mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun')[]
  setWeeklyEvery: React.Dispatch<React.SetStateAction<string>>
  setWeeklyOn: React.Dispatch<
    React.SetStateAction<
      ('mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun')[]
    >
  >
}) {
  const { t } = useTranslation(['apps.calendar', 'common.misc'])

  return (
    <>
      <div className="flex w-full items-center gap-3">
        <TextInput
          darker
          required
          className="flex-1"
          icon="tabler:repeat"
          name={t('inputs.weekly.inputs.every')}
          namespace={false}
          placeholder={t('inputs.number')}
          setValue={setWeeklyEvery}
          value={weeklyEvery}
        />
        <p className="text-bg-500">{t('inputs.weekly.inputs.weeks')}</p>
      </div>
      <ListboxOrComboboxInput
        multiple
        required
        buttonContent={
          <>
            {weeklyOn
              .map(day =>
                t(
                  `common.misc:dates.days.${[
                    'mon',
                    'tue',
                    'wed',
                    'thu',
                    'fri',
                    'sat',
                    'sun'
                  ].indexOf(day)}`
                )
              )
              .join(', ')}
          </>
        }
        className="flex-1"
        customActive={weeklyOn.length > 0}
        icon="tabler:calendar"
        name={t('inputs.weekly.inputs.onDays')}
        namespace={false}
        setValue={setWeeklyOn}
        type="listbox"
        value={weeklyOn}
      >
        {['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map(day => (
          <ListboxOrComboboxOption
            key={day}
            text={t(
              `common.misc:dates.days.${[
                'mon',
                'tue',
                'wed',
                'thu',
                'fri',
                'sat',
                'sun'
              ].indexOf(day)}`
            )}
            value={day}
          />
        ))}
      </ListboxOrComboboxInput>
    </>
  )
}

export default WeeklyForm
