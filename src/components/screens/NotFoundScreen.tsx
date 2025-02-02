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
        <Button as={Link} icon="tabler:arrow-left" to="/">
          {t('buttons.goBack')}
        </Button>
        <Button
          as="a"
          href="https://github.com/Lifeforge-app/lifeforge/issues"
          icon="tabler:bug"
          rel="noopener noreferrer"
          target="_blank"
          variant="secondary"
        >
          {t('buttons.reportBug')}
        </Button>
      </div>
    </div>
  )
}

export default NotFoundScreen
