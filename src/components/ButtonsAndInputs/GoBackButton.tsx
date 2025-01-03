import React from 'react'
import { useTranslation } from 'react-i18next'
import Button from './Button'

function GoBackButton({
  onClick
}: {
  onClick: () => void
}): React.ReactElement {
  const { t } = useTranslation()

  return (
    <Button
      onClick={onClick}
      icon="tabler:chevron-left"
      variant="no-bg"
      className="px-0 py-2 hover:!bg-transparent dark:hover:!bg-transparent"
    >
      {t('button.goBack')}
    </Button>
  )
}

export default GoBackButton
