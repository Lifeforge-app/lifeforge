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
      onClick={onClick}
      icon="tabler:chevron-left"
      variant="no-bg"
      className="mb-2 w-min px-0 py-2 pl-2 hover:bg-transparent! dark:hover:bg-transparent!"
    >
      {t('buttons.goBack')}
    </Button>
  )
}

export default GoBackButton
