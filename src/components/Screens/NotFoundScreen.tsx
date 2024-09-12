import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import Button from '../ButtonsAndInputs/Button'

function NotFoundScreen(): React.ReactElement {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <div className="flex-center flex size-full flex-col gap-6">
      <h1 className="text-[10rem] text-custom-500">;-;</h1>
      <h1 className="text-4xl font-semibold">{t('notFound.title')}</h1>
      <h2 className="-mt-2 text-xl text-bg-500">{t('notFound.description')}</h2>
      <div className="mt-6 flex items-center gap-4">
        <Button
          icon="tabler:arrow-left"
          onClick={() => {
            navigate('/')
          }}
        >
          go back home
        </Button>
        <Button
          icon="tabler:bug"
          onClick={() => {
            const a = document.createElement('a')
            a.href =
              'https://github.com/melvinchia3636/personalManagementSystem/issues'
            a.target = '_blank'
            a.rel = 'noopener noreferrer'
            a.click()
          }}
          variant="secondary"
        >
          report bug
        </Button>
      </div>
    </div>
  )
}

export default NotFoundScreen
