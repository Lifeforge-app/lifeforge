import { memo, useCallback } from 'react'

import { Flex, Icon, Text, Transition } from '@/components/primitives'

function _IconEntry({
  icon,
  iconSet,
  onIconSelected
}: {
  icon: string
  iconSet: string
  onIconSelected: (icon: string) => void
}) {
  const handleIconSelected = useCallback(() => {
    onIconSelected(`${iconSet}:${icon}`)
  }, [icon, iconSet, onIconSelected])

  return (
    <Transition>
      <Flex
        align="center"
        as="button"
        bg={{ base: 'transparent', hover: 'bg-200', darkHover: 'bg-800' }}
        direction="column"
        p="md"
        r="lg"
        style={{ cursor: 'pointer' }}
        width="100%"
        onClick={handleIconSelected}
      >
        <Icon icon={`${iconSet}:${icon}`} size="2em" />
        <Text
          align="center"
          mt="md"
          size="sm"
          style={{ marginBottom: '-0.125rem' }}
          tracking="wide"
          weight="medium"
          wordBreak="break-all"
        >
          {icon.replace(/-/g, ' ')}
        </Text>
      </Flex>
    </Transition>
  )
}

export const IconEntry = memo(_IconEntry)
