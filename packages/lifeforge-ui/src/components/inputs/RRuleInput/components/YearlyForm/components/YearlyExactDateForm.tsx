import { useTranslation } from 'react-i18next'

import { Box } from '@components/primitives'
import { ListboxInput, ListboxOption, NumberInput } from '@components/inputs'
import type { FreqSpecificParams } from '@components/inputs/RRuleInput/RRuleInput'

function YearlyExactDateForm({
  data,
  setData
}: {
  data: FreqSpecificParams['yearly']
  setData: (data: FreqSpecificParams['yearly']) => void
}) {
  const { t } = useTranslation(['apps.calendar', 'common.misc'])

  return (
    <>
      <Box flex="1">
        <ListboxInput
          required
          buttonContent={<>{t(`common.misc:dates.months.${data.month - 1}`)}</>}
          icon="tabler:calendar"
          label={t('inputs.yearly.exactDate.inputs.month')}
          value={data.month}
          onChange={value => setData({ ...data, month: value })}
        >
          {Array(12)
            .fill(0)
            .map((_, month) => (
              <ListboxOption
                key={month}
                label={t(`common.misc:dates.months.${month}`)}
                value={month + 1}
              />
            ))}
        </ListboxInput>
      </Box>
      <Box flex="1">
        <NumberInput
          required
          icon="tabler:calendar"
          label={t('inputs.yearly.exactDate.inputs.date')}
          value={data.date}
          onChange={value => setData({ ...data, date: value })}
        />
      </Box>
    </>
  )
}

export default YearlyExactDateForm
