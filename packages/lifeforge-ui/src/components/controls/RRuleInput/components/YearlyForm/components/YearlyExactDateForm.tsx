import { useTranslation } from 'react-i18next'

import { ListboxInput, ListboxOption, NumberInput } from '@components/controls'
import type { FreqSpecificParams } from '@components/controls/RRuleInput'

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
      <ListboxInput
        required
        buttonContent={<>{t(`common.misc:dates.months.${data.month - 1}`)}</>}
        className="flex-1"
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
      <NumberInput
        required
        className="flex-1"
        icon="tabler:calendar"
        label={t('inputs.yearly.exactDate.inputs.date')}
        value={data.date}
        onChange={value => setData({ ...data, date: value })}
      />
    </>
  )
}

export default YearlyExactDateForm
