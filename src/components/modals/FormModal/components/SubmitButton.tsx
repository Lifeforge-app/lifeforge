import React from 'react'
import { CreateOrModifyButton, Button } from '@components/buttons'

function SubmitButton({
  submitButtonLabel,
  submitButtonIcon,
  submitButtonIconAtEnd,
  submitLoading,
  openType,
  onSubmitButtonClick
}: {
  submitButtonLabel: string
  submitButtonIcon?: string
  submitButtonIconAtEnd?: boolean
  submitLoading: boolean
  openType?: 'create' | 'update' | null
  onSubmitButtonClick: () => Promise<void>
}): React.ReactElement {
  return (
    <>
      {['create', 'update'].includes(openType ?? '') ? (
        <CreateOrModifyButton
          loading={submitLoading}
          type={openType as 'create' | 'update'}
          onClick={() => {
            onSubmitButtonClick().catch(console.error)
          }}
        />
      ) : (
        <Button
          className="mt-4"
          icon={submitButtonIcon ?? ''}
          iconAtEnd={submitButtonIconAtEnd}
          loading={submitLoading}
          onClick={() => {
            onSubmitButtonClick().catch(console.error)
          }}
        >
          {submitButtonLabel}
        </Button>
      )}
    </>
  )
}

export default SubmitButton
