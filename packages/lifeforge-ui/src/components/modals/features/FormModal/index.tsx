import { Button } from '@components/buttons'
import type {
  FormFieldPropsUnion,
  FormState,
  InferFormFinalState,
  InferFormState
} from '@components/modals/features/FormModal/typescript/form_interfaces'
import { LoadingScreen } from '@components/screens'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import ModalHeader from '../../core/components/ModalHeader'
import FormInputs from './components/FormInputs'
import SubmitButton from './components/SubmitButton'
import { checkEmpty, getInitialData } from './utils/formUtils'

function FormModal({
  form: { fields, fieldTypes, initialData, onSubmit, onChange },
  ui: { title, icon, namespace, loading = false, onClose, submitButton },
  actionButton,
  externalData
}: {
  form: {
    fields: Record<string, FormFieldPropsUnion>
    fieldTypes: Record<string, FormFieldPropsUnion['type']>
    initialData?: Partial<InferFormState<typeof fieldTypes, typeof fields>>
    onSubmit: (
      data: InferFormFinalState<typeof fieldTypes, typeof fields>
    ) => Promise<void>
    onChange?: (data: InferFormState<typeof fieldTypes, typeof fields>) => void
  }
  ui: {
    title: string
    icon: string
    onClose: () => void
    namespace?: string
    loading?: boolean
    submitButton: 'create' | 'update' | React.ComponentProps<typeof Button>
  }
  actionButton?: {
    icon: string
    dangerous?: boolean
    onClick?: () => void
  }
  externalData?: {
    data: InferFormState<typeof fieldTypes, typeof fields>
    setData: React.Dispatch<
      React.SetStateAction<InferFormState<typeof fieldTypes, typeof fields>>
    >
  }
}) {
  const [internalData, setInternalData] = useState<
    InferFormState<typeof fieldTypes, typeof fields>
  >(
    getInitialData(fieldTypes, fields, initialData) as InferFormState<
      typeof fieldTypes,
      typeof fields
    >
  )

  // Determine the source of form data
  // If external data is provided, use it; otherwise, use internal state
  const data = externalData ? externalData.data : internalData

  const setData = externalData ? externalData.setData : setInternalData

  const [submitLoading, setSubmitLoading] = useState(false)

  /**
   * Handles the form submission process for the FormModal component.
   *
   * @remarks
   * The function handles various field types with specific transformations:
   * - `datetime`: Converts to ISO 8601 format (YYYY-MM-DDTHH:mm:ssZ)
   * - `location`: Ensures undefined for falsy values
   * - `currency`/`number`: Converts to Number type
   * - `file`: Extracts the file property from the file object
   * - `checkbox`: Converts to Boolean type
   *
   * @returns A Promise that resolves when the submission process is complete
   *
   * @throws Will not throw errors directly, but may propagate errors from the onSubmit callback
   */
  async function onSubmitButtonClick(): Promise<void> {
    // Validates that all required, non-hidden fields have been filled
    const requiredFields = Object.entries(fields).filter(
      field => field[1]?.required && !field[1].hidden
    )

    const missingFields = requiredFields.filter(field =>
      checkEmpty(data[field[0]])
    )

    // Show error toast if any required fields are missing
    if (missingFields.length) {
      toast.error(
        `The following fields are required: ${missingFields
          .map(field => field[1]?.label)
          .join(', ')}`
      )

      return
    }

    setSubmitLoading(true)

    // Transform field values based on their types
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
            finalValue =
              (value as { file: string | File | null }).file ?? undefined
            break
          case 'checkbox':
            finalValue = Boolean(value)
            break
          default:
            finalValue = value
        }

        return [key, finalValue]
      })
    )

    // Call the onSubmit callback with the final data
    // Close the modal on successful submission
    if (onSubmit) {
      try {
        await onSubmit(
          finalData as InferFormFinalState<typeof fieldTypes, typeof fields>
        )
        onClose()
      } finally {
        setSubmitLoading(false)
      }
    }
  }

  // Notify parent component of data changes
  useEffect(() => {
    onChange?.(data)
  }, [data, onChange])

  return (
    <div className="min-w-[50vw]">
      <ModalHeader
        actionButtonProps={actionButton}
        icon={icon}
        namespace={namespace ? namespace : undefined}
        title={title}
        onClose={onClose}
      />
      {!loading ? (
        <>
          <FormInputs
            data={data as FormState}
            fields={fields}
            namespace={namespace}
            setData={setData as React.Dispatch<React.SetStateAction<FormState>>}
          />
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
