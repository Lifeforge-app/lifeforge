import { Button } from '@components/inputs'

/**
 * Nothing too fancy either, just a button saying 'Go Back'
 */
function GoBackButton({
  onClick
}: {
  /**
   * Callback function to handle the button click event.
   */
  onClick: () => void
}) {
  return (
    <Button
      icon="tabler:chevron-left"
      style={{
        padding: '0.5em 0.9em 0.5em 0.5em !important',
        width: 'fit-content'
      }}
      variant="plain"
      onClick={onClick}
    >
      Go Back
    </Button>
  )
}

export default GoBackButton
