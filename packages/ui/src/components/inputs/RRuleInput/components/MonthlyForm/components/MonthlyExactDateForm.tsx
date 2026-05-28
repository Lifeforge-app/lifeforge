import { useTranslation } from 'react-i18next'

import { NumberInput } from '@/components/inputs'
import type { FreqSpecificParams } from '@/components/inputs/RRuleInput'
import { Box } from '@/components/primitives'

export function MonthlyExactDateForm({
  data,
  setData
}: {
  data: FreqSpecificParams['monthly']
  setData: (data: FreqSpecificParams['monthly']) => void
}) {
  const { t } = useTranslation(['apps.calendar', 'common.misc'])

  return (
    <Box flex="1">
      <NumberInput
        required
        icon="tabler:calendar"
        label={t('inputs.monthly.exactDate.inputs.date')}
        value={data.onDate}
        onChange={date => setData({ ...data, onDate: date })}
      />
    </Box>
  )
}
