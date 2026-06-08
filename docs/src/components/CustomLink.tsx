import { Link } from 'react-router'

import { Flex, Icon, Text, Transition } from '@lifeforge/ui'

function CustomLink({ text, to }: { text: string; to: string }) {
  return (
    <Transition>
      <Text
        asChild
        color={{ base: 'primary', hover: 'custom-600' }}
        size="lg"
        weight="medium"
      >
        <Flex align="center" as={Link} gap="sm" mt="md" to={to}>
          {text}
          <Icon
            icon="tabler:arrow-right"
            style={{
              marginBottom: '-0.25em'
            }}
          />
        </Flex>
      </Text>
    </Transition>
  )
}

export default CustomLink
