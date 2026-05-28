import { Flex, Icon, Text } from '@lifeforge/ui'

function AuthFooter() {
  return (
    <Flex centered as="footer" direction="column" gap="sm" mt="xl">
      <Flex centered gap="sm">
        {[
          'creative-commons',
          'creative-commons-by',
          'creative-commons-nc',
          'creative-commons-sa'
        ].map(icon => (
          <Icon
            key={icon}
            color="bg-500"
            icon={`tabler:${icon}`}
            size="1.5em"
          />
        ))}
      </Flex>
      <Text align="center" color="bg-500" size="sm">
        A project by{' '}
        <Text
          as="a"
          color="custom-500"
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
          color="custom-500"
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
    </Flex>
  )
}

export default AuthFooter
