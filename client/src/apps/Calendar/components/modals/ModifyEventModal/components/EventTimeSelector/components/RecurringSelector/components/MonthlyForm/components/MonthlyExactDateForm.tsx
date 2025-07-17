import { TextInput } from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'

function MonthlyExactDateForm({
  monthlyOnDate,
  setMonthlyOnDate
}: {
  monthlyOnDate: string
  setMonthlyOnDate: React.Dispatch<React.SetStateAction<string>>
}) {
  const { t } = useTranslation(['apps.calendar', 'common.misc'])

  return (
    <>
      <TextInput
        darker
        required
        className="flex-1"
        icon="tabler:calendar"
        name={t('inputs.monthly.exactDate.inputs.date')}
        namespace={false}
        placeholder={t('inputs.date')}
        setValue={setMonthlyOnDate}
        value={monthlyOnDate}
      />
    </>
  )
}

export default MonthlyExactDateForm
