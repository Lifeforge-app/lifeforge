import Button from './Button'

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
      className="mb-2 w-min px-0 py-2 pl-2 hover:bg-transparent! dark:hover:bg-transparent!"
      icon="tabler:chevron-left"
      variant="plain"
      onClick={onClick}
    >
      Go Back
    </Button>
  )
}

export default GoBackButton
