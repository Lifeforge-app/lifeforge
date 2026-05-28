import { Box, Flex, Icon, Text } from '@/components/primitives'

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
      <Box
        as="a"
        bg="custom-500"
        href={frontendURL}
        mt="3xl"
        p="md"
        px="lg"
        rounded="md"
        style={{
          color: 'var(--color-bg-800)',
          fontWeight: 600,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          transition: 'all 0.2s'
        }}
      >
        <Flex align="center" gap="sm" justify="center">
          <Icon icon="tabler:hammer" size="1.5rem" />
          Go to System
        </Flex>
      </Box>
    </Flex>
  )
}
