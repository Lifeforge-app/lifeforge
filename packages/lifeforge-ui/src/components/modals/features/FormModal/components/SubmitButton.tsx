import _ from 'lodash'

import { Button } from '@components/controls'

function SubmitButton({
  submitButton,
  submitLoading,
  onSubmitButtonClick
}: {
  submitButton: 'create' | 'update' | React.ComponentProps<typeof Button>
  submitLoading: boolean
  onSubmitButtonClick: () => Promise<void>
}) {
  if (typeof submitButton === 'string') {
    return (
      <Button
        className="mt-6 w-full"
        icon={submitButton === 'create' ? 'tabler:plus' : 'tabler:pencil'}
        loading={submitLoading}
        onClick={onSubmitButtonClick}
      >
        {_.upperFirst(submitButton)}
      </Button>
    )
  }

  if (submitButton) {
    return (
      <Button
        className="mt-6 w-full"
        {...submitButton}
        loading={submitLoading}
        onClick={onSubmitButtonClick}
      />
    )
  }

  return <></>
}

export default SubmitButton
