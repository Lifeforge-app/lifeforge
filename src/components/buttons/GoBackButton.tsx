import React from 'react'
import Button from './Button'

function GoBackButton({
  onClick
}: {
  onClick: () => void
}): React.ReactElement {
  return (
    <Button
      onClick={onClick}
      icon="tabler:chevron-left"
      variant="no-bg"
      className="mb-2 w-min px-0 py-2 pl-2 hover:bg-transparent! dark:hover:bg-transparent!"
    >
      Go Back
    </Button>
  )
}

export default GoBackButton
