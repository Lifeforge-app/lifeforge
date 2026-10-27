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
  return (
    <Box flex="1">
      <NumberInput
        required
        icon="tabler:calendar"
        label="monthly.exactDate.inputs.date"
        namespace="common.recurring"
        value={data.onDate}
        onChange={date => setData({ ...data, onDate: date })}
      />
    </Box>
  )
}
