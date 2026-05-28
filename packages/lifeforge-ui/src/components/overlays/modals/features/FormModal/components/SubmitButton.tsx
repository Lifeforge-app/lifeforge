import _ from 'lodash'

import { Button } from '@components/inputs'

export function SubmitButton({
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
        icon={submitButton === 'create' ? 'tabler:plus' : 'tabler:pencil'}
        loading={submitLoading}
        mt="lg"
        width="100%"
        onClick={onSubmitButtonClick}
      >
        {_.upperFirst(submitButton)}
      </Button>
    )
  }

  if (submitButton) {
    return (
      <Button
        mt="lg"
        width="100%"
        {...submitButton}
        loading={submitLoading}
        onClick={onSubmitButtonClick}
      />
    )
  }

  return <></>
}
