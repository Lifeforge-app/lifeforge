import { useTranslation } from 'react-i18next'

import { NumberInput } from '@components/controls'
import type { FreqSpecificParams } from '@components/controls/RRuleInput'

function MonthlyExactDateForm({
  data,
  setData
}: {
  data: FreqSpecificParams['monthly']
  setData: (data: FreqSpecificParams['monthly']) => void
}) {
  const { t } = useTranslation(['apps.calendar', 'common.misc'])

  return (
    <>
      <NumberInput
        required
        className="flex-1"
        icon="tabler:calendar"
        label={t('inputs.monthly.exactDate.inputs.date')}
        value={data.onDate}
        onChange={date => setData({ ...data, onDate: date })}
      />
    </>
  )
}

export default MonthlyExactDateForm
