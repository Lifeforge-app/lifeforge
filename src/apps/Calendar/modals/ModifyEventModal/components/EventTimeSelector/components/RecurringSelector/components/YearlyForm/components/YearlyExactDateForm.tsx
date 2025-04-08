import { useTranslation } from 'react-i18next'

import {
  ListboxOrComboboxInput,
  ListboxOrComboboxOption,
  TextInput
} from '@lifeforge/ui'

function YearlyExactDateForm({
  yearlyMonth,
  yearlyDate,
  setYearlyMonth,
  setYearlyDate
}: {
  yearlyMonth: number
  yearlyDate: string
  setYearlyMonth: React.Dispatch<React.SetStateAction<number>>
  setYearlyDate: React.Dispatch<React.SetStateAction<string>>
}) {
  const { t } = useTranslation(['apps.calendar', 'common.misc'])
  return (
    <>
      <ListboxOrComboboxInput
        required
        buttonContent={<>{t(`common.misc:dates.months.${yearlyMonth}`)}</>}
        className="flex-1"
        icon="tabler:calendar"
        name={t('inputs.yearly.exactDate.inputs.month')}
        namespace={false}
        setValue={setYearlyMonth}
        type="listbox"
        value={yearlyMonth}
      >
        {Array(12)
          .fill(0)
          .map((_, month) => (
            <ListboxOrComboboxOption
              key={month}
              text={t(`common.misc:dates.months.${month}`)}
              value={month}
            />
          ))}
      </ListboxOrComboboxInput>
      <TextInput
        darker
        required
        className="flex-1"
        icon="tabler:calendar"
        name={t('inputs.yearly.exactDate.inputs.date')}
        namespace={false}
        placeholder={t('inputs.date')}
        setValue={setYearlyDate}
        value={yearlyDate}
      />
    </>
  )
}

export default YearlyExactDateForm
