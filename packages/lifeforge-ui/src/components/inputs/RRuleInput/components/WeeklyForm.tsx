import { useTranslation } from 'react-i18next'

import { ListboxInput, ListboxOption, NumberInput } from '@components/inputs'

import type { FreqSpecificParams } from '..'

function WeeklyForm({
  data,
  setData
}: {
  data: FreqSpecificParams['weekly']
  setData: (data: FreqSpecificParams['weekly']) => void
}) {
  const { t } = useTranslation(['apps.calendar', 'common.misc'])

  return (
    <>
      <div className="flex w-full items-center gap-3">
        <NumberInput
          required
          className="flex-1"
          icon="tabler:repeat"
          label={t('inputs.weekly.inputs.every')}
          value={data.every}
          onChange={every => setData({ ...data, every })}
        />
        <p className="text-bg-500">{t('inputs.weekly.inputs.weeks')}</p>
      </div>
      <ListboxInput
        multiple
        required
        buttonContent={
          <>
            {data.onDays
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
        customActive={data.onDays.length > 0}
        icon="tabler:calendar"
        label={t('inputs.weekly.inputs.onDays')}
        value={data.onDays}
        onChange={onDays => setData({ ...data, onDays: onDays })}
      >
        {['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map(day => (
          <ListboxOption
            key={day}
            label={t(
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
      </ListboxInput>
    </>
  )
}

export default WeeklyForm
