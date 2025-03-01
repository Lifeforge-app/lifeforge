import React from 'react'
import { CreateOrModifyButton, Button } from '@components/buttons'

function SubmitButton({
  submitButtonProps,
  submitLoading,
  openType,
  onSubmitButtonClick
}: {
  submitButtonProps: React.ComponentProps<typeof Button>
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
          {...submitButtonProps}
          loading={submitLoading}
          onClick={() => {
            onSubmitButtonClick().catch(console.error)
          }}
        />
      )}
    </>
  )
}

export default SubmitButton
