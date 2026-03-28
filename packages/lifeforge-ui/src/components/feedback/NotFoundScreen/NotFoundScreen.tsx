import { useTranslation } from 'react-i18next'

import { Button } from '@components/inputs'
import { Flex, Text } from '@components/primitives'

interface NotFoundScreenProps {
  /** The title to display on the Not Found screen. Defaults to a translated "Not Found" message. */
  title?: string
  /** The message to display on the Not Found screen. Defaults to a translated description message. */
  message?: string
  /** A link to report a bug. Defaults to LifeForge's GitHub issues page. */
  reportIssueLink?: string
}

function NotFoundScreen({
  title,
  message,
  reportIssueLink = 'https://github.com/LifeForge-app/lifeforge/issues'
}: NotFoundScreenProps) {
  const { t } = useTranslation('common.misc')

  return (
    <Flex
      align="center"
      direction="column"
      flexGrow="1"
      gap="lg"
      justify="center"
      px="xl"
      width="100%"
    >
      <Text
        color="custom-500"
        style={{ fontSize: '10rem', lineHeight: '13rem' }}
      >
        ;-;
      </Text>
      <Text align="center" as="h1" size="4xl" weight="semibold">
        {title ?? t('notFound.title')}
      </Text>
      <Text align="center" as="p" color="bg-500" size="xl">
        {message ?? t('notFound.description')}
      </Text>
      <Flex align="center" justify="center" mt="lg" style={{ gap: '0.75rem' }}>
        <Button asChild icon="tabler:arrow-left">
          <a href="/">Go Back</a>
        </Button>
        <Button
          asChild
          icon="tabler:bug"
          namespace="common.misc"
          variant="secondary"
        >
          <a href={reportIssueLink} rel="noopener noreferrer" target="_blank">
            Report Bug
          </a>
        </Button>
      </Flex>
    </Flex>
  )
}

export default NotFoundScreen
