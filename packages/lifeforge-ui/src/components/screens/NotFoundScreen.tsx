import { useTranslation } from 'react-i18next'
import { Link } from 'shared'

import Button from '../buttons/Button'

function NotFoundScreen({
  title,
  description
}: {
  title?: string
  description?: string
}) {
  const { t } = useTranslation('common.misc')

  return (
    <div className="flex-center w-full flex-1 flex-col gap-6">
      <span className="text-custom-500 text-[10rem]">;-;</span>
      <h1 className="text-4xl font-semibold">{title ?? t('notFound.title')}</h1>
      <p className="text-bg-500 text-xl">
        {description ?? t('notFound.description')}
      </p>
      <div className="flex-center mt-6 gap-3">
        <Button as="a" icon="tabler:arrow-left" href="/">
          Go Back
        </Button>
        <Button
          as="a"
          href="https://github.com/Lifeforge-app/lifeforge/issues"
          icon="tabler:bug"
          namespace="common.misc"
          rel="noopener noreferrer"
          target="_blank"
          variant="secondary"
        >
          Report Bug
        </Button>
      </div>
    </div>
  )
}

export default NotFoundScreen
