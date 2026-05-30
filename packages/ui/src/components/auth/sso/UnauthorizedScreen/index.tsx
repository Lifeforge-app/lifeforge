import { Button } from '@/components/inputs'
import { Flex, Icon, Text } from '@/components/primitives'

export function UnauthorizedScreen({ frontendURL }: { frontendURL: string }) {
  return (
    <Flex
      align="center"
      direction="column"
      height="100%"
      justify="center"
      width="100%"
    >
      <Icon icon="tabler:lock-access" mb="md" size="8rem" />
      <Text size="4xl" weight="semibold">
        Unauthorized Personnel
      </Text>
      <Text align="center" color="muted" mt="md" size="lg">
        Please authenticate through single sign-on (SSO) in the system to access
        the locale editor.
      </Text>
      <Button as="a" href={frontendURL} icon="tabler:hammer">
        Go to System
      </Button>
    </Flex>
  )
}
