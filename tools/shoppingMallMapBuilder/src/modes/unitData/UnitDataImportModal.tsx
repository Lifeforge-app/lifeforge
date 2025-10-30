import { FormModal, defineForm } from 'lifeforge-ui'
import z from 'zod'

const SCHEMA = z.array(
  z.object({
    name: z.string(),
    unit: z.string(),
    desc: z.string(),
    logoUrl: z.string().url()
  })
)

function UnitDataImportModal({
  onClose,
  data: { setUnitData }
}: {
  onClose: () => void
  data: {
    setUnitData: (
      data: Array<{
        name: string
        unit: string
        desc: string
        logoUrl: string
      }>
    ) => void
  }
}) {
  const { formProps } = defineForm<{
    rawJson: string
  }>({
    icon: 'tabler:braces',
    title: 'Import Unit Data',
    submitButton: {
      icon: 'tabler:upload',
      children: 'Import'
    },
    onClose
  })
    .typesMap({
      rawJson: 'textarea'
    })
    .setupFields({
      rawJson: {
        icon: 'tabler:braces',
        label: 'Unit Data (JSON)',
        placeholder:
          '[{"name": string, "unit": string, "desc": string, "logoUrl": string}, ...]',
        required: true,
        rows: 10,
        validator: z.string().refine(value => {
          try {
            const parsed = JSON.parse(value)

            SCHEMA.parse(parsed)

            return true
          } catch (err) {
            console.error('Error parsing JSON:', err)

            return false
          }
        }, 'Invalid JSON format')
      }
    })
    .onSubmit(async values => {
      const parsed = JSON.parse(values.rawJson) as Array<{
        name: string
        unit: string
        desc: string
        logoUrl: string
      }>

      setUnitData(parsed)
    })
    .build()

  return <FormModal {...formProps} />
}

export default UnitDataImportModal
