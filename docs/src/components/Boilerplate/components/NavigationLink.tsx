import _ from 'lodash'
import { Link } from 'react-router'

import { Box, Flex, Icon, Text, Transition } from '@lifeforge/ui'

function NavigationLink({
  section,
  direction
}: {
  section: { group: string; section: string } | null
  direction: 'previous' | 'next'
}) {
  if (!section) return <Box />

  const isLeft = direction === 'previous'

  return (
    <Transition>
      <Flex asChild align="center" gap="sm">
        <Text
          as={Link}
          color={{
            base: 'bg-800',
            dark: 'bg-100',
            hover: 'custom-500'
          }}
          to={`/${section.group}/${section.section}`}
        >
          {isLeft && <Icon icon="tabler:arrow-left" size="1.25rem" />}
          <Text size="lg" weight="medium">
            {_.startCase(section.section.replace(/-/g, ' '))}
          </Text>
          {!isLeft && <Icon icon="tabler:arrow-right" size="1.25rem" />}
        </Text>
      </Flex>
    </Transition>
  )
}

export default NavigationLink
