import { Button } from '@components/buttons'
import type {
  FormFieldConfig,
  IFormState,
  InferFinalDataType,
  InferFormStateFromFields
} from '@components/modals/features/FormModal/typescript/form_interfaces'
import { LoadingScreen } from '@components/screens'
import dayjs from 'dayjs'
import _ from 'lodash'
import { useState } from 'react'
import { toast } from 'react-toastify'

import ModalHeader from '../../core/components/ModalHeader'
import FormInputs from './components/FormInputs'
import SubmitButton from './components/SubmitButton'

const transformExistedData = (
  field: FormFieldConfig[keyof FormFieldConfig],
  value: unknown
): unknown => {
  if (field?.type === 'datetime' && value) {
    return dayjs(value as string).toDate()
  }

  if (field?.type === 'file' && value) {
    return { file: value, preview: value }
  }

  return value
}

const getInitialData = <TFormState extends FormFieldConfig<any>>(
  fields: TFormState,
  formExistedData?: Partial<InferFormStateFromFields<TFormState>>
) => {
  return Object.fromEntries(
    Object.entries(fields).map(([key, field]) => {
      if (formExistedData && key in formExistedData) {
        return [key, transformExistedData(field, formExistedData[key])]
      }

      let finalValue: unknown = ''

      switch (field?.type) {
        case 'number':
        case 'currency':
          finalValue = 0
          break
        case 'datetime':
        case 'location':
          finalValue = null
          break
        case 'listbox':
          finalValue = field.multiple ? [] : null
          break
        case 'checkbox':
          finalValue = false
          break
        case 'file':
          finalValue = { file: null, preview: null }
          break
        default:
          finalValue = ''
      }

      return [key, finalValue]
    })
  )
}

function FormModal<TFields extends FormFieldConfig<any>>({
  form: { fields, existedData, additionalFields, onSubmit },
  ui,
  submitButton = {
    children: 'Submit',
    icon: 'tabler:check'
  },
  actionButton
}: {
  form: {
    fields: TFields
    existedData?: Partial<InferFormStateFromFields<TFields>>
    additionalFields?: React.ReactNode
    onSubmit: (data: InferFinalDataType<TFields>) => Promise<void>
  }
  ui: {
    title: string
    icon: string
    onClose: () => void
    namespace: string
    loading?: boolean
  }
  submitButton: 'create' | 'update' | React.ComponentProps<typeof Button>
  actionButton?: {
    icon: string
    isRed?: boolean
    onClick?: () => void
  }
}) {
  const [data, setData] = useState<InferFormStateFromFields<TFields>>(
    getInitialData(fields, existedData) as InferFormStateFromFields<TFields>
  )

  const [submitLoading, setSubmitLoading] = useState(false)

  async function onSubmitButtonClick(): Promise<void> {
    const requiredFields = Object.entries(fields).filter(
      field => field[1]?.required
    )

    const missingFields = requiredFields.filter(field =>
      _.isEmpty(data[field[0]])
    )

    if (missingFields.length) {
      toast.error(
        `The following fields are required: ${missingFields
          .map(field => field[1]?.label)
          .join(', ')}`
      )

      return
    }

    setSubmitLoading(true)

    const finalData = Object.fromEntries(
      Object.entries(data).map(([key, value]) => {
        const fieldType = fields[key]?.type

        if (!fieldType) {
          return [key, value]
        }

        let finalValue: unknown = value

        switch (fieldType) {
          case 'datetime':
            finalValue = value
              ? dayjs(value as never).format('YYYY-MM-DDTHH:mm:ssZ')
              : undefined
            break
          case 'location':
            finalValue = value ?? undefined
            break
          case 'currency':
          case 'number':
            finalValue = Number(value)
            break
          case 'file':
            finalValue = (value as { file: string | File | null }).file
            break
          case 'checkbox':
            finalValue = Boolean(value)
            break
          default:
            finalValue = value
        }

        return JSON.parse(JSON.stringify([key, finalValue]))
      })
    )

    if (onSubmit) {
      await onSubmit(finalData as InferFinalDataType<TFields>)
      setSubmitLoading(false)

      return
    }
  }

  return (
    <div className="min-w-[50vw]">
      <ModalHeader
        actionButtonIcon={actionButton?.icon}
        actionButtonIsRed={actionButton?.isRed}
        icon={ui.icon}
        namespace={ui.namespace}
        title={ui.title}
        onActionButtonClick={actionButton?.onClick}
        onClose={ui.onClose}
      />
      {!ui.loading ? (
        <>
          <FormInputs
            data={data as IFormState}
            fields={fields}
            namespace={ui.namespace}
            setData={
              setData as React.Dispatch<React.SetStateAction<IFormState>>
            }
          />
          {additionalFields}
          <SubmitButton
            submitButton={submitButton}
            submitLoading={submitLoading}
            onSubmitButtonClick={onSubmitButtonClick}
          />
        </>
      ) : (
        <LoadingScreen />
      )}
    </div>
  )
}

export default FormModal
