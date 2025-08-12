import type { FreqSpecificParams } from '../..'
import SelectableFormWrapper from '../SelectableFormWrapper'
import YearlyExactDateForm from './components/YearlyExactDateForm'
import YearlyRelativeDayForm from './components/YearlyRelativeDayForm'

function YearlyForm({
  data,
  setData
}: {
  data: FreqSpecificParams['yearly']
  setData: (data: FreqSpecificParams['yearly']) => void
}) {
  const forms = [
    {
      id: 'exactDate',
      icon: 'tabler:calendar',
      component: <YearlyExactDateForm data={data} setData={setData} />
    },
    {
      id: 'relativeDay',
      icon: 'tabler:repeat',
      component: <YearlyRelativeDayForm data={data} setData={setData} />
    }
  ]

  return (
    <>
      {forms.map(form => (
        <SelectableFormWrapper
          key={form.id}
          formId={`yearly.${form.id}`}
          selected={data.type === form.id}
          onSelect={() => {
            setData({ ...data, type: form.id as 'exactDate' | 'relativeDay' })
          }}
        >
          {form.component}
        </SelectableFormWrapper>
      ))}
    </>
  )
}

export default YearlyForm
