import NumberInput from '@components/inputs/NumberInput'
import type { FreqSpecificParams } from '@components/inputs/RRuleInput'
import { useTranslation } from 'react-i18next'

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
        namespace={false}
        setValue={date => setData({ ...data, onDate: date })}
        value={data.onDate}
      />
    </>
  )
}

export default MonthlyExactDateForm
