import { useTranslation } from 'react-i18next'

import { NumberInput } from '@components/controls'

import type { FreqSpecificParams } from '..'

function HourlyForm({
  data,
  setData
}: {
  data: FreqSpecificParams['hourly']
  setData: (data: FreqSpecificParams['hourly']) => void
}) {
  const { t } = useTranslation(['apps.calendar', 'common.misc'])

  return (
    <>
      <div className="flex w-full items-center gap-3">
        <NumberInput
          required
          className="flex-1"
          icon="tabler:repeat"
          label={t('inputs.hourly.inputs.every')}
          value={data.every}
          onChange={every => setData({ ...data, every })}
        />
        <p className="text-bg-500">{t('inputs.hourly.inputs.hours')}</p>
      </div>
    </>
  )
}

export default HourlyForm
