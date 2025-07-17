import { Button } from '@components/buttons'

function SubmitButton({
  submitButtonProps,
  submitLoading,
  openType,
  onSubmitButtonClick
}: {
  submitButtonProps?: React.ComponentProps<typeof Button>
  submitLoading: boolean
  openType?: 'create' | 'update' | null
  onSubmitButtonClick: () => Promise<void>
}) {
  if (submitButtonProps) {
    return (
      <Button
        className="mt-6 w-full"
        {...submitButtonProps}
        loading={submitLoading}
        onClick={onSubmitButtonClick}
      />
    )
  }

  if (['create', 'update'].includes(openType ?? '')) {
    return (
      <Button
        className="mt-6 w-full"
        icon={openType === 'create' ? 'tabler:plus' : 'tabler:pencil'}
        loading={submitLoading}
        onClick={onSubmitButtonClick}
      >
        {openType === 'create' ? 'Create' : 'Update'}
      </Button>
    )
  }

  return <></>
}

export default SubmitButton
