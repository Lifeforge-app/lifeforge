import { Flex, Icon, type IconProps, Text } from '@lifeforge/ui'

function TextWithIcon({
  icon,
  children
}: {
  icon: IconProps['icon']
  children?: React.ReactNode
}) {
  return (
    <Flex
      asChild
      align="center"
      display="inline-flex"
      gap="sm"
      style={{ transform: 'translateY(0.125rem)' }}
    >
      <Text color={{ base: 'bg-800', dark: 'bg-100' }}>
        <Icon icon={icon} size="1em" />
        {children}
      </Text>
    </Flex>
  )
}

export default TextWithIcon
