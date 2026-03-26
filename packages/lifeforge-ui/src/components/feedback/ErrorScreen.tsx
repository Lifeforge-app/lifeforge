import { Icon } from '@iconify/react'

import { Button } from '@components/inputs'
import { Flex, Text } from '@components/primitives'

import * as styles from './ErrorScreen.css'

interface ErrorScreenProps {
  /** The error message to display. Can be a string or a React node for more complex formatting. */
  message: string | React.ReactNode
  /** Whether to show a retry button that reloads the page */
  showRetryButton?: boolean
}

/**
 * A reusable error screen component for displaying error messages.
 */
function ErrorScreen({ message, showRetryButton }: ErrorScreenProps) {
  return (
    <Flex
      align="center"
      direction="column"
      gap="lg"
      height="100%"
      justify="center"
      width="100%"
    >
      <Icon
        className={styles.errorColor}
        icon="tabler:alert-triangle"
        style={{ width: '4rem', height: '4rem' }}
      />
      <Text
        as="p"
        align="center"
        className={styles.errorColor}
        size="lg"
        weight="medium"
      >
        {message}
      </Text>
      {showRetryButton && (
        <Button
          icon="tabler:refresh"
          variant="secondary"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      )}
    </Flex>
  )
}

export default ErrorScreen
