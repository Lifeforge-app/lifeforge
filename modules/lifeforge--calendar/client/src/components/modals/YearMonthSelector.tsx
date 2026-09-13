import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { getI18n } from 'react-i18next'
import z from 'zod'

import { FormModal, ListboxField, createDefaultValues } from '@lifeforge/ui'

const schema = z.object({
  year: z.number().int(),
  month: z.number().int().gte(1).lte(12)
})

const yearOptions = Array.from({ length: 100 }).map((_, index, arr) => {
  const year = new Date().getFullYear() - arr.length / 2 + index

  return {
    text: year.toString(),
    value: year
  }
})

function YearMonthSelector({
  onClose,
  data: { onSelect }
}: {
  onClose: () => void
  data: {
    onSelect: (year: number, month: number) => void
  }
}) {
  const form = useForm({
    defaultValues: {
      ...createDefaultValues(schema),
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1
    },
    mode: 'all',
    resolver: zodResolver(schema)
  })

  return (
    <FormModal
      form={form}
      submissionConfig={{
        handler: async values => {
          onSelect(values.year, values.month)
        },
        icon: 'tabler:check',
        label: 'Select'
      }}
      uiConfig={{
        icon: 'tabler:calendar',

        title: 'Select Year and Month',
        onClose
      }}
    >
      <ListboxField
        required
        control={form.control}
        icon="tabler:calendar"
        label="Year"
        name="year"
        options={yearOptions}
      />
      <ListboxField
        required
        control={form.control}
        icon="tabler:calendar"
        label="Month"
        name="month"
        options={Array.from({ length: 12 }).map((_, index) => {
          const t = getI18n().t.bind(getI18n())
          const month = index + 1

          return {
            text: t('common.misc:dates.months.' + (month - 1).toString()),
            value: month
          }
        })}
      />
    </FormModal>
  )
}

export default YearMonthSelector
