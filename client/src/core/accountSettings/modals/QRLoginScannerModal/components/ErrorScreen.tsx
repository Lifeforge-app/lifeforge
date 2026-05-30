import {
  Button,
  Flex,
  Icon,
  Stack,
  Text,
  colorWithOpacity
} from '@lifeforge/ui'

function ErrorScreen({
  onClose,
  errorMessage
}: {
  onClose: () => void
  errorMessage: string
}) {
  return (
    <Stack align="center" gap="lg" height="100%">
      <Flex
        centered
        bg={colorWithOpacity('dangerous', '20%')}
        height="5em"
        r="lg"
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
