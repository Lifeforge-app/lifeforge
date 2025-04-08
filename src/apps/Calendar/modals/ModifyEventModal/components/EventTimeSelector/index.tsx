import { Icon } from '@iconify/react/dist/iconify.js'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'

import { Button, DateInput } from '@lifeforge/ui'

import useComponentBg from '@hooks/useComponentBg'

import { ICalendarEventFormState } from '../../../../interfaces/calendar_interfaces'
import RecurringSelector from './components/RecurringSelector'

function EventTimeSelector({
  formState,
  setFormState
}: {
  formState: ICalendarEventFormState
  setFormState: React.Dispatch<React.SetStateAction<ICalendarEventFormState>>
}) {
  const { t } = useTranslation(['apps.calendar', 'common.misc'])
  const { componentBgLighter } = useComponentBg()

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
      <DateInput
        darker
        hasTime
        required
        className="mt-4"
        date={formState.start}
        icon="tabler:clock"
        name="Start Time"
        namespace="apps.calendar"
        setDate={date => {
          setFormState({
            ...formState,
            start: date
          })
        }}
      />
      {formState.type === 'recurring' && <RecurringSelector />}
      {formState.type === 'single' && (
        <DateInput
          darker
          hasTime
          required
          className="mt-4"
          date={formState.end}
          icon="tabler:clock"
          name="End Time"
          namespace="apps.calendar"
          setDate={date => {
            setFormState({
              ...formState,
              end: date
            })
          }}
        />
      )}
    </div>
  )
}

export default EventTimeSelector
