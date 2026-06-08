import { Flex, Icon, Text } from '@lifeforge/ui'
import type { IconProps } from '@lifeforge/ui'

function FolderHeading({
  icon,
  children
}: {
  icon: IconProps['icon']
  children: string
}) {
  return (
    <Flex align="center" gap="sm">
      <Icon icon={icon} />
      <Text as="code" size="xl">
        {children}
      </Text>
    </Flex>
  )
}

export default FolderHeading
