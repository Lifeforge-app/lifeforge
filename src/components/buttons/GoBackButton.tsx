import React from 'react'
import { useTranslation } from 'react-i18next'
import Button from './Button'

function GoBackButton({
  onClick
}: {
  onClick: () => void
}): React.ReactElement {
  const { t } = useTranslation('common.misc')

  return (
    <Button
      className="mb-2 w-min px-0 py-2 pl-2 hover:bg-transparent! dark:hover:bg-transparent!"
      icon="tabler:chevron-left"
      variant="no-bg"
      onClick={onClick}
    >
      {t('buttons.goBack')}
    </Button>
  )
}

export default GoBackButton
