import NumberInput from '@components/inputs/NumberInput'
import { useTranslation } from 'react-i18next'

import type { FreqSpecificParams } from '..'

function DailyForm({
  data,
  setData
}: {
  data: FreqSpecificParams['daily']
  setData: (data: FreqSpecificParams['daily']) => void
}) {
  const { t } = useTranslation(['apps.calendar', 'common.misc'])

  return (
    <>
      <div className="flex w-full items-center gap-3">
        <NumberInput
          required
          className="flex-1"
          icon="tabler:repeat"
          label={t('inputs.daily.inputs.every')}
          namespace={false}
          setValue={every => setData({ ...data, every })}
          value={data.every}
        />
        <p className="text-bg-500">{t('inputs.daily.inputs.days')}</p>
      </div>
    </>
  )
}

export default DailyForm
