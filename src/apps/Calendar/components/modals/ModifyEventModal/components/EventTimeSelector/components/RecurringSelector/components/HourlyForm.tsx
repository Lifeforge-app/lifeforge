import React from 'react'
import { useTranslation } from 'react-i18next'

import { TextInput } from '@lifeforge/ui'

function HourlyForm({
  hourlyEvery,
  setHourlyEvery
}: {
  hourlyEvery: string
  setHourlyEvery: React.Dispatch<React.SetStateAction<string>>
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
          name={t('inputs.hourly.inputs.every')}
          namespace={false}
          placeholder={t('inputs.number')}
          setValue={setHourlyEvery}
          value={hourlyEvery}
        />
        <p className="text-bg-500">{t('inputs.hourly.inputs.hours')}</p>
      </div>
    </>
  )
}

export default HourlyForm
