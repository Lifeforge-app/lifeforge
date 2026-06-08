import { Flex, Icon, Text } from '@/components/primitives'

interface LoadingScreenProps {
  /** An optional message to display below the loading indicator. */
  message?: string
  /** An optional size for the loading indicator. Default to 2.5rem. */
  loaderSize?: string
}

export function LoadingScreen({ message, loaderSize }: LoadingScreenProps) {
  return (
    <Text asChild color="muted" size="lg" weight="medium">
      <Flex
        align="center"
        direction="column"
        flexGrow="1"
        height="100%"
        justify="center"
        width="100%"
      >
        <Icon
          color="muted"
          icon="svg-spinners:ring-resize"
          style={{
            // Deliberately defined explicitly to prevent styling issue
            fontSize: loaderSize || '2rem'
          }}
        />
        {message && (
          <Text
            style={{
              // Deliberately defined explicitly to prevent styling issue
              marginTop: '1em'
            }}
          >
            {message}
          </Text>
        )}
      </Flex>
    </Text>
  )
}
