import { Icon } from '@iconify/react'

import { Flex, Text } from '@components/primitives'

interface LoadingScreenProps {
  /** An optional message to display below the loading indicator. */
  message?: string
  /** An optional size for the loading indicator. Default to 2.5rem. */
  loaderSize?: string
}

export default function LoadingScreen({
  message,
  loaderSize
}: LoadingScreenProps) {
  return (
    <Flex
      align="center"
      direction="column"
      flexGrow="1"
      gap="md"
      height="100%"
      justify="center"
      width="100%"
    >
      <Icon
        icon="svg-spinners:ring-resize"
        style={{
          fontSize: loaderSize || '2rem',
          color: 'var(--color-bg-500)'
        }}
      />
      {message && (
        <Text color="bg-500" weight="medium">
          {message}
        </Text>
      )}
    </Flex>
  )
}
