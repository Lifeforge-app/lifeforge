import { Flex, Icon, Stack, Text } from '@lifeforge/ui'

function FooterSection() {
  return (
    <Stack align="center" as="footer" gap="sm" pb={{ base: 'lg', sm: '2xl' }}>
      <Flex align="center" color="muted" gap="sm">
        <Icon icon="tabler:creative-commons" size="1.5rem" />
        <Icon icon="tabler:creative-commons-by" size="1.5rem" />
        <Icon icon="tabler:creative-commons-nc" size="1.5rem" />
        <Icon icon="tabler:creative-commons-sa" size="1.5rem" />
      </Flex>
      <Text align="center" color="muted" size="sm">
        A project by{' '}
        <Text
          as="a"
          color="primary"
          decoration="underline"
          href="https://thecodeblog.net"
          rel="noreferrer"
          target="_blank"
        >
          Melvin Chia
        </Text>{' '}
        licensed under{' '}
        <Text
          as="a"
          color="primary"
          decoration="underline"
          href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
          rel="noreferrer"
          target="_blank"
        >
          CC BY-NC-SA 4.0
        </Text>
        .
      </Text>
    </Stack>
  )
}

export default FooterSection
