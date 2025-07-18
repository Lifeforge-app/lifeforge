import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import type { RecordModel } from 'pocketbase'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { useAPIEndpoint } from 'shared/lib'

import { Button } from '@components/buttons'
import useModifyMutation from '@components/modals/features/FormModal/hooks/useModifyMutation'
import type {
  IFieldProps,
  IFormState
} from '@components/modals/features/FormModal/typescript/modal_interfaces'
import { LoadingScreen } from '@components/screens'

import ModalHeader from '../../core/components/ModalHeader'
import FormInputs from './components/FormInputs'
import SubmitButton from './components/SubmitButton'

function FormModal<T extends IFormState, U extends RecordModel>({
  // fields stuff
  fields,
  additionalFields,
  data,
  setData,

  // modal stuff
  title,
  icon,
  openType,
  onClose,
  loading = false,

  // submit stuff
  onSubmit,
  id,
  endpoint,
  queryKey,
  getFinalData,
  sortBy,
  sortMode,
  submitButtonProps = {
    children: 'Submit',
    icon: 'tabler:check'
  },
  customUpdateDataList,

  // action button stuff
  actionButtonIcon,
  actionButtonIsRed,
  onActionButtonClick,

  // misc stuff
  namespace
}: {
  modalRef?: React.RefObject<HTMLDivElement | null>
  fields: IFieldProps<T>[]
  additionalFields?: React.ReactNode
  data: T
  setData: React.Dispatch<React.SetStateAction<T>>
  title: string
  icon: string
  openType?: 'create' | 'update' | null
  onClose: () => void
  submitButtonProps?: React.ComponentProps<typeof Button>
  onSubmit?: () => Promise<void>
  queryKey?: unknown[]
  endpoint?: string
  id?: string
  loading?: boolean
  actionButtonIcon?: string
  actionButtonIsRed?: boolean
  onActionButtonClick?: () => void
  namespace: string
  getFinalData?: (originalData: T) => Promise<Record<string, unknown>>
  sortBy?: keyof U
  sortMode?: 'asc' | 'desc'
  customUpdateDataList?: {
    create?: (newData: U) => void
    update?: (newData: U) => void
  }
}) {
  const apiHost = useAPIEndpoint()

  const queryClient = useQueryClient()

  const [submitLoading, setSubmitLoading] = useState(false)

  const entryCreateMutation = useModifyMutation<U>(
    'create',
    apiHost,
    endpoint ?? '',
    {
      onSettled: () => {
        setSubmitLoading(false)
      },
      onSuccess: (newData: U) => {
        if (customUpdateDataList?.create) {
          customUpdateDataList.create(newData)
        } else {
          queryClient.setQueryData<U[]>(queryKey ?? [], old => {
            if (!old) return []

            return [...old, newData].sort((a, b) => {
              if (sortBy) {
                if (sortMode === 'asc') {
                  return a[sortBy] > b[sortBy] ? 1 : -1
                }

                return a[sortBy] < b[sortBy] ? 1 : -1
              }

              return 0
            })
          })
        }
        onClose()
      }
    }
  )

  const entryUpdateMutation = useModifyMutation<U>(
    'update',
    apiHost,
    `${endpoint}/${id}`,
    {
      onSettled: () => {
        setSubmitLoading(false)
      },
      onSuccess: (newData: U) => {
        if (customUpdateDataList?.update) {
          customUpdateDataList.update(newData)
        } else {
          queryClient.setQueryData<U[]>(queryKey ?? [], old => {
            if (!old) return []

            return old
              .map(entry => {
                if (entry.id === newData.id) {
                  return newData
                }

                return entry
              })
              .sort((a, b) => {
                if (sortBy) {
                  if (sortMode === 'asc') {
                    return a[sortBy] > b[sortBy] ? 1 : -1
                  }

                  return a[sortBy] < b[sortBy] ? 1 : -1
                }

                return 0
              })
          })
        }
        onClose()
      }
    }
  )

  async function onSubmitButtonClick(): Promise<void> {
    const requiredFields = fields.filter(field => field.required)

    const missingFields = requiredFields.filter(field => {
      const value = data[field.id]

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
          .map(field => field.label)
          .join(', ')}`
      )

      return
    }

    setSubmitLoading(true)

    const finalData = Object.fromEntries(
      Object.entries(getFinalData ? await getFinalData(data) : data).map(
        ([key, value]) => {
          if (value instanceof Date) {
            return [key, dayjs(value).format('YYYY-MM-DDTHH:mm:ssZ')]
          }

          if (typeof value === 'object' && 'image' in (value ?? {})) {
            return [key, (value as { image: string | File | null }).image]
          }

          return JSON.parse(JSON.stringify([key, value]))
        }
      )
    )

    if (onSubmit) {
      await onSubmit()
      setSubmitLoading(false)

      return
    }

    if (openType === 'create') {
      entryCreateMutation.mutate(finalData as Partial<U>)
    } else if (openType === 'update') {
      entryUpdateMutation.mutate(finalData as Partial<U>)
    }
  }

  return (
    <div className="min-w-[50vw]">
      <ModalHeader
        actionButtonIcon={actionButtonIcon}
        actionButtonIsRed={actionButtonIsRed}
        icon={icon}
        namespace={namespace}
        title={title}
        onActionButtonClick={onActionButtonClick}
        onClose={onClose}
      />
      {!loading ? (
        <>
          <FormInputs
            data={data}
            fields={fields}
            namespace={namespace}
            setData={setData}
          />
          {additionalFields}
          <SubmitButton
            openType={openType}
            submitButtonProps={submitButtonProps}
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
