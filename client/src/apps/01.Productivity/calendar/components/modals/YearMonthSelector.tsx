import { t } from 'i18next'
import { FormModal, defineForm } from 'lifeforge-ui'

function YearMonthSelector({
  onClose,
  data: { onSelect }
}: {
  onClose: () => void
  data: {
    onSelect: (year: number, month: number) => void
  }
}) {
  const { formProps } = defineForm<{
    year: number
    month: number
  }>({
    icon: 'tabler:calendar',
    title: 'Select Year and Month',
    onClose,
    submitButton: {
      children: 'Select',
      icon: 'tabler:check'
    },
    namespace: 'apps.calendar'
  })
    .typesMap({
      year: 'listbox',
      month: 'listbox'
    })
    .setupFields({
      year: {
        icon: 'tabler:calendar',
        label: 'Year',
        options: Array.from({ length: 100 }).map((_, index, arr) => {
          const year = new Date().getFullYear() - arr.length / 2 + index

          return {
            text: year.toString(),
            value: year
          }
        }),
        required: true,
        multiple: false
      },
      month: {
        icon: 'tabler:calendar',
        label: 'Month',
        required: true,
        multiple: false,
        options: Array.from({ length: 12 }).map((_, index) => {
          const month = index + 1

          return {
            text: t('common.misc:dates.months.' + (month - 1).toString()),
            value: month
          }
        }),
        defaultValue: new Date().getMonth() + 1
      }
    })
    .initialData({
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1
    })
    .onSubmit(async values => {
      onSelect(values.year, values.month)
    })
    .build()

  return <FormModal {...formProps} />
}

export default YearMonthSelector
