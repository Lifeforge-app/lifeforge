import { useTranslation } from 'react-i18next'

import { NumberInput } from '@components/inputs'

import type { FreqSpecificParams } from '../..'
import SelectableFormWrapper from '../SelectableFormWrapper'
import MonthlyExactDateForm from './components/MonthlyExactDateForm'
import MonthlyRelativeDayForm from './components/MonthlyRelativeDayForm'

function MonthlyForm({
  data,
  setData
}: {
  data: FreqSpecificParams['monthly']
  setData: (data: FreqSpecificParams['monthly']) => void
}) {
  const { t } = useTranslation(['apps.calendar', 'common.misc'])

  const forms = [
    {
      id: 'exactDate',
      icon: 'tabler:calendar',
      component: <MonthlyExactDateForm data={data} setData={setData} />
    },
    {
      id: 'relativeDay',
      icon: 'tabler:calendar',
      component: <MonthlyRelativeDayForm data={data} setData={setData} />
    }
  ] as const

  return (
    <>
      <div className="flex w-full items-center gap-3">
        <NumberInput
          className="flex-1"
          icon="tabler:repeat"
          label={t('inputs.monthly.inputs.every')}
          value={data.every}
          onChange={every => setData({ ...data, every })}
        />
        <p className="text-bg-500">{t('inputs.monthly.inputs.months')}</p>
      </div>
      {forms.map(form => (
        <SelectableFormWrapper
          key={form.id}
          formId={`monthly.${form.id}`}
          selected={data.type === form.id}
          onSelect={() => {
            setData({ ...data, type: form.id })
          }}
        >
          {form.component}
        </SelectableFormWrapper>
      ))}
    </>
  )
}

export default MonthlyForm
