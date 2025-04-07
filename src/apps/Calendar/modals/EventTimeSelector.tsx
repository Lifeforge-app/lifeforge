import { Icon } from '@iconify/react/dist/iconify.js'
import clsx from 'clsx'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  Button,
  ListboxOrComboboxInput,
  ListboxOrComboboxOption
} from '@lifeforge/ui'

import useComponentBg from '@hooks/useComponentBg'

import { ICalendarEventFormState } from '../interfaces/calendar_interfaces'

function EventTimeSelector({
  formState,
  setFormState
}: {
  formState: ICalendarEventFormState
  setFormState: React.Dispatch<React.SetStateAction<ICalendarEventFormState>>
}) {
  const [freq, setFreq] = useState<
    'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly'
  >('yearly')
  const { componentBgLighter } = useComponentBg()

  const { t } = useTranslation('apps.calendar')

  return (
    <div
      className={clsx('shadow-custom mt-4 rounded-lg p-6', componentBgLighter)}
    >
      <div className="flex w-full items-center gap-5">
        <Icon
          className="text-bg-500 size-6 shrink-0"
          icon="tabler:clock-hour-3"
        />
        <span className="text-bg-500">{t('inputs.eventTime')}</span>
      </div>
      <div className="mt-6 flex w-full items-center gap-2">
        {(
          [
            {
              text: 'single',
              icon: 'tabler:calendar'
            },
            {
              text: 'recurring',
              icon: 'tabler:repeat'
            }
          ] as const
        ).map(item => (
          <Button
            key={item.text}
            className="w-1/2"
            icon={item.icon}
            variant={formState.type === item.text ? 'primary' : 'plain'}
            onClick={() => setFormState({ ...formState, type: item.text })}
          >
            {t(`eventTypes.${item.text}`)}
          </Button>
        ))}
      </div>
      <ListboxOrComboboxInput
        buttonContent={<>{t(`recurringFreqs.${freq}`)}</>}
        className="mt-4"
        icon="tabler:repeat"
        name="frequency"
        namespace="apps.calendar"
        setValue={setFreq}
        type="listbox"
        value={freq}
      >
        {['hourly', 'daily', 'weekly', 'monthly', 'yearly'].map(freq => (
          <ListboxOrComboboxOption
            key={freq}
            text={t(`recurringFreqs.${freq}`)}
            value={freq}
          />
        ))}
      </ListboxOrComboboxInput>
    </div>
  )
}

export default EventTimeSelector
