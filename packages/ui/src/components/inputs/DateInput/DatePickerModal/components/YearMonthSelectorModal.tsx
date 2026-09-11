import { zodResolver } from '@hookform/resolvers/zod'
import dayjs from 'dayjs'
import { range } from 'lodash'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { FormModal } from '@/components/form/components/FormModal'
import { ListboxField } from '@/components/form/components/fields/ListboxField'

const schema = z.object({
  year: z.number(),
  month: z.number()
})

type FormData = z.infer<typeof schema>

export function YearMonthSelectorModal({
  onClose,
  data: { yearMonth, onSelect }
}: {
  onClose: () => void
  data: {
    yearMonth: dayjs.Dayjs
    onSelect: (year: number, month: number) => void
  }
}) {
  const currentYear = dayjs().year()

  const form = useForm<FormData>({
    defaultValues: {
      year: yearMonth.year(),
      month: yearMonth.month()
    },
    resolver: zodResolver(schema)
  })

  return (
    <FormModal
      form={form}
      submissionConfig={{
        icon: 'tabler:check',
        label: 'Select',
        handler: data => {
          onSelect(data.year, data.month)
          onClose()
        }
      }}
      uiConfig={{
        icon: 'tabler:calendar',
        title: 'datePicker.yearMonth',
        onClose
      }}
    >
      <ListboxField
        required
        control={form.control}
        icon="tabler:calendar-month"
        label="Month"
        name="month"
        namespace={false}
        options={range(12).map(month => ({
          value: month,
          text: dayjs().month(month).format('MMMM')
        }))}
      />
      <ListboxField
        required
        control={form.control}
        icon="tabler:calendar"
        label="Year"
        name="year"
        namespace={false}
        options={range(currentYear - 80, currentYear + 25).map(year => ({
          value: year,
          text: `${year}`
        }))}
      />
    </FormModal>
  )
}
