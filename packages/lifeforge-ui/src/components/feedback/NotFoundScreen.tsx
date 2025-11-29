import { useTranslation } from 'react-i18next'

import { Button } from '@components/inputs'

interface NotFoundScreenProps {
  /** The title to display on the Not Found screen. Defaults to a translated "Not Found" message. */
  title?: string
  /** The message to display on the Not Found screen. Defaults to a translated description message. */
  message?: string
  /** A link to report a bug. Defaults to Lifeforge's GitHub issues page. */
  reportIssueLink?: string
}

/**
 * A reusable 404 Not Found screen component.
 * This is the default screen shown when a user navigates to a non-existent route.
 * Can also be used to indicate missing resources.
 */
function NotFoundScreen({
  title,
  message,
  reportIssueLink = 'https://github.com/Lifeforge-app/lifeforge/issues'
}: NotFoundScreenProps) {
  const { t } = useTranslation('common.misc')

  return (
    <div className="flex-center w-full flex-1 flex-col gap-6 px-8 text-center">
      <span className="text-custom-500 text-[10rem] leading-52">;-;</span>
      <h1 className="text-4xl font-semibold">{title ?? t('notFound.title')}</h1>
      <p className="text-bg-500 text-xl">
        {message ?? t('notFound.description')}
      </p>
      <div className="flex-center mt-6 gap-3">
        <Button as="a" href="/" icon="tabler:arrow-left">
          Go Back
        </Button>
        <Button
          as="a"
          href={reportIssueLink}
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
