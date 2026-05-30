import { Bordered, Box, Icon, Text } from '@/components/primitives'

export function SidebarItemIcon({
  icon,
  active,
  className
}: {
  icon?: string | React.ReactElement
  active: boolean
  className?: string
}) {
  if (icon === undefined) {
    return null
  }

  if (typeof icon !== 'string') {
    return icon
  }

  if (icon.startsWith('customHTML:')) {
    const htmlString = icon.replace('customHTML:', '')

    return (
      <Text asChild color={active ? 'custom-500' : undefined}>
        <Box
          className={className}
          dangerouslySetInnerHTML={{ __html: htmlString }}
          flexShrink="0"
          height="1.5em"
          width="1.5em"
        />
      </Text>
    )
  }

  if (icon.startsWith('url:')) {
    const urlString = icon.replace('url:', '')

    return (
      <Bordered
        borderColor="bg-500"
        borderWidth={active ? '1px' : '0px'}
        flexShrink="0"
        overflow="hidden"
        r="sm"
      >
        <img
          className={className}
          src={urlString}
          style={{
            height: '1.5rem',
            width: '1.5rem'
          }}
        />
      </Bordered>
    )
  }

  return (
    <Icon
      className={className}
      color={active ? 'custom-500' : undefined}
      icon={icon}
      size="1.5rem"
    />
  )
}
