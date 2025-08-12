import NumberInput from '@components/inputs/NumberInput'
import { useTranslation } from 'react-i18next'

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
          namespace={false}
          setValue={every => setData({ ...data, every })}
          value={data.every}
        />
        <p className="text-bg-500">{t('inputs.hourly.inputs.hours')}</p>
      </div>
    </>
  )
}

export default HourlyForm
