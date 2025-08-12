import ListboxInput from '@components/inputs/ListboxInput'
import ListboxOption from '@components/inputs/ListboxInput/components/ListboxOption'
import NumberInput from '@components/inputs/NumberInput'
import type { FreqSpecificParams } from '@components/inputs/RRuleInput'
import { useTranslation } from 'react-i18next'

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
        namespace={false}
        setValue={value => setData({ ...data, month: value })}
        value={data.month}
      >
        {Array(12)
          .fill(0)
          .map((_, month) => (
            <ListboxOption
              key={month}
              text={t(`common.misc:dates.months.${month}`)}
              value={month + 1}
            />
          ))}
      </ListboxInput>
      <NumberInput
        required
        className="flex-1"
        icon="tabler:calendar"
        label={t('inputs.yearly.exactDate.inputs.date')}
        namespace={false}
        setValue={value => setData({ ...data, date: value })}
        value={data.date}
      />
    </>
  )
}

export default YearlyExactDateForm
