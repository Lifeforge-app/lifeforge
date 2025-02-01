import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Button from '../buttons/Button'

function NotFoundScreen(): React.ReactElement {
  const { t } = useTranslation('common.misc')

  return (
    <div className="flex-center w-full flex-col gap-6">
      <span className="text-[10rem] text-custom-500">;-;</span>
      <h1 className="text-4xl font-semibold">{t('notFound.title')}</h1>
      <p className="text-xl text-bg-500">{t('notFound.description')}</p>
      <div className="flex-center mt-6 gap-4">
        <Button icon="tabler:arrow-left" as={Link} to="/">
          {t('buttons.goBack')}
        </Button>
        <Button
          icon="tabler:bug"
          as="a"
          variant="secondary"
          href="https://github.com/Lifeforge-app/lifeforge/issues"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('buttons.reportBug')}
        </Button>
      </div>
    </div>
  )
}

export default NotFoundScreen
