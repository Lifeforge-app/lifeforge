import { Flex, Icon, Stack, Text } from '@lifeforge/ui'

function AuthFooter() {
  return (
    <Stack centered as="footer" mt="xl">
      <Flex centered gap="sm">
        {[
          'creative-commons',
          'creative-commons-by',
          'creative-commons-nc',
          'creative-commons-sa'
        ].map(icon => (
          <Icon key={icon} color="muted" icon={`tabler:${icon}`} size="1.5em" />
        ))}
      </Flex>
      <Text align="center" color="muted" size="sm">
        A project by{' '}
        <Text
          as="a"
          color="primary"
          href="https://melvinchia.dev"
          rel="noreferrer"
          style={{
            textDecoration: 'underline'
          }}
          target="_blank"
        >
          Melvin Chia
        </Text>{' '}
        licensed under{' '}
        <Text
          as="a"
          color="primary"
          href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
          rel="noreferrer"
          style={{
            textDecoration: 'underline'
          }}
          target="_blank"
        >
          CC BY-NC-SA 4.0
        </Text>
        .
      </Text>
    </Stack>
  )
}

export default AuthFooter
