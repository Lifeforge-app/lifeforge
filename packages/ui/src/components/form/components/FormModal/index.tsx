import {
  type FieldValues,
  type SubmitHandler,
  type UseFormReturn
} from 'react-hook-form'
import { toast } from 'react-toastify'

import { usePromiseLoading } from '@lifeforge/shared'

import { LoadingScreen } from '@/components/feedback'
import { Button } from '@/components/inputs'
import { ModalHeader } from '@/components/overlays'
import { Flex, Stack } from '@/components/primitives'

const SUBMISSION_CONFIG_TEMPLATE = {
  create: {
    label: 'Create',
    icon: 'tabler:plus'
  },
  update: {
    label: 'Update',
    icon: 'tabler:pencil'
  }
} as const

type SubmissionConfig<T extends FieldValues> =
  | {
      template: keyof typeof SUBMISSION_CONFIG_TEMPLATE
      disabled?: boolean
      handler: SubmitHandler<T>
    }
  | {
      label: string
      icon: string
      disabled?: boolean
      handler: SubmitHandler<T>
    }

export function FormModal<T extends FieldValues>({
  form,
  uiConfig: { title, icon, namespace, loading = false, onClose, headerActions },
  submissionConfig,
  children
}: {
  form: UseFormReturn<T>
  uiConfig: {
    title: string | React.ReactNode
    icon: string
    onClose: () => void
    namespace?: string
    loading?: boolean
    headerActions?: React.ReactNode
  }
  submissionConfig: SubmissionConfig<T>
  children: React.ReactNode
}) {
  const handleSubmit = form.handleSubmit(async values => {
    try {
      await submissionConfig.handler(values)

      onClose?.()
    } catch (error) {
      console.error(error)
      toast.error('Failed to submit form. Please check the console for details')
    }
  })

  const [submitButtonLoading, onSubmitButtonClick] =
    usePromiseLoading(handleSubmit)

  const finalSubmissionConfig =
    'template' in submissionConfig
      ? SUBMISSION_CONFIG_TEMPLATE[submissionConfig.template]
      : submissionConfig

  return (
    <Stack gap="sm" minWidth="50vw">
      <ModalHeader
        headerActions={headerActions}
        icon={icon}
        namespace={namespace ? namespace : undefined}
        title={title}
        onClose={onClose}
      />
      {!loading ? (
        <>
          {children}
          <Button
            icon={finalSubmissionConfig.icon}
            loading={submitButtonLoading}
            mt="lg"
            width="100%"
            onClick={onSubmitButtonClick}
          >
            {finalSubmissionConfig.label}
          </Button>
        </>
      ) : (
        <Flex
          align="center"
          direction="column"
          flex="1"
          justify="center"
          minHeight="24em"
        >
          <LoadingScreen />
        </Flex>
      )}
    </Stack>
  )
}
