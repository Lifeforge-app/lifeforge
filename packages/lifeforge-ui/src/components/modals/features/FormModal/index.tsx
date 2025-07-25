import { Button } from '@components/buttons'
import type {
  FormFieldConfig,
  IFormState,
  InferFinalDataType
} from '@components/modals/features/FormModal/typescript/form_interfaces'
import { LoadingScreen } from '@components/screens'
import dayjs from 'dayjs'
import { useState } from 'react'
import { toast } from 'react-toastify'

import ModalHeader from '../../core/components/ModalHeader'
import FormInputs from './components/FormInputs'
import SubmitButton from './components/SubmitButton'

function FormModal<TFormState extends IFormState>({
  form: { fields, additionalFields, data, setData, onSubmit },
  ui,
  submitButton = {
    children: 'Submit',
    icon: 'tabler:check'
  },
  actionButton
}: {
  form: {
    fields: FormFieldConfig<TFormState>
    additionalFields?: React.ReactNode
    data: TFormState
    setData: React.Dispatch<React.SetStateAction<TFormState>>
    onSubmit: (data: InferFinalDataType<TFormState>) => Promise<void>
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
  const [submitLoading, setSubmitLoading] = useState(false)

  async function onSubmitButtonClick(): Promise<void> {
    const requiredFields = Object.entries(fields).filter(
      field => field[1].required
    )

    const missingFields = requiredFields.filter(field => {
      const value = data[field[0]]

      return (
        !value ||
        (typeof value === 'string' && !value.trim()) ||
        (typeof value === 'object' &&
          !Array.isArray(value) &&
          !value.image &&
          JSON.stringify(value) === '{}')
      )
    })

    if (missingFields.length) {
      toast.error(
        `The following fields are required: ${missingFields
          .map(field => field[1].label)
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
              ? dayjs(value).format('YYYY-MM-DDTHH:mm:ssZ')
              : null
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
      await onSubmit(finalData as InferFinalDataType<TFormState>)
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
            data={data}
            fields={fields}
            namespace={ui.namespace}
            setData={setData}
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
