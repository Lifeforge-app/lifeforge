import React from 'react'
import { useTranslation } from 'react-i18next'

import { TextInput } from '@lifeforge/ui'

function DailyForm({
  dailyEvery,
  setDailyEvery
}: {
  dailyEvery: string
  setDailyEvery: React.Dispatch<React.SetStateAction<string>>
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
          name={t('inputs.daily.inputs.every')}
          namespace={false}
          placeholder={t('inputs.number')}
          setValue={setDailyEvery}
          value={dailyEvery}
        />
        <p className="text-bg-500">{t('inputs.daily.inputs.days')}</p>
      </div>
    </>
  )
}

export default DailyForm
