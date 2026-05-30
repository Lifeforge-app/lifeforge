import {
  Button,
  COLORS,
  Flex,
  Icon,
  Stack,
  Text,
  withOpacity
} from '@lifeforge/ui'

function ErrorScreen({
  onClose,
  errorMessage
}: {
  onClose: () => void
  errorMessage: string
}) {
  return (
    <Stack align="center" gap="lg" height="100dvh">
      <Flex
        centered
        height="5em"
        r="lg"
        style={{
          backgroundColor: withOpacity(COLORS['dangerous'], 0.2)
        }}
        width="5em"
      >
        <Icon color="dangerous" icon="tabler:alert-circle" size="2.25em" />
      </Flex>
      <Text size="xl" weight="medium">
        {errorMessage}
      </Text>
      <Button
        icon="tabler:x"
        mt="md"
        variant="secondary"
        width="100%"
        onClick={onClose}
      >
        Close
      </Button>
    </Stack>
  )
}

export default ErrorScreen
