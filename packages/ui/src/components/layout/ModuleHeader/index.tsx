import _ from 'lodash'

import { useModuleMetadata } from '@lifeforge/federation'
import { useModuleTranslation } from '@lifeforge/localization'

import { Button } from '@/components/inputs'
import { Box, Flex, Icon, Text } from '@/components/primitives'
import { colorWithOpacity } from '@/system'

import { useMainSidebarState } from '../../../providers'

function getTKeys(
  namespace: string | undefined,
  title: string,
  target: string
) {
  const withPrefix = (middle: string) => [
    `${middle}${_.camelCase(title)}.${target}`,
    `${middle}${title}.${target}`,
    ...(namespace
      ? [
          `${namespace}:${middle}${_.camelCase(title)}.${target}`,
          `${namespace}:${middle}${title}.${target}`
        ]
      : [])
  ]

  return [
    ...withPrefix('subsections.'),
    ...withPrefix(''),
    `common.${title}:${target}`,
    target
  ]
}

interface ModuleHeaderProps {
  icon?: string
  title?: string
  trailing?: React.ReactNode
  namespace?: string | false
}

export function ModuleHeader({
  icon,
  title,
  trailing,
  namespace
}: ModuleHeaderProps) {
  const { title: innerTitle, icon: innerIcon } = useModuleMetadata()

  title = title ?? innerTitle
  icon = icon ?? innerIcon

  const { t } = useModuleTranslation(
    namespace === false ? [] : [`common.${title}`, namespace ?? '']
  )

  const { toggleSidebar, sidebarExpanded } = useMainSidebarState()

  return (
    <Flex
      align="center"
      as="header"
      gap="xl"
      justify="between"
      mb="lg"
      minWidth="0"
      width="100%"
    >
      <Flex align="center" gap="md" minWidth="0" width="100%">
        {!sidebarExpanded && (
          <Box asChild display={{ base: 'block', sm: 'none' }}>
            <Button
              icon="tabler:menu"
              variant="plain"
              onClick={toggleSidebar}
            />
          </Box>
        )}
        {icon !== undefined && (
          <Flex
            align="center"
            bg={colorWithOpacity('custom-500', '20%')}
            flexShrink="0"
            height={{
              base: '3.5em',
              sm: '4em'
            }}
            justify="center"
            r="lg"
            width={{
              base: '3.5em',
              sm: '4em'
            }}
          >
            <Icon color="primary" icon={icon} size="2rem" />
          </Flex>
        )}
        <Flex direction="column" gap="xs" minWidth="0" width="100%">
          <Text
            asChild
            size={{ base: '2xl', sm: '3xl' }}
            weight="semibold"
            whiteSpace="nowrap"
          >
            <Flex
              align="end"
              as="h1"
              minWidth="0"
              style={{ gap: '0.75rem' }}
              width="100%"
            >
              <Text truncate display="block">
                {namespace === false
                  ? (title?.toString() ?? '')
                  : t(getTKeys(namespace, title, 'title'))}
              </Text>
            </Flex>
          </Text>
          <Box asChild minWidth="0" width="100%">
            <Text
              truncate
              color="muted"
              size={{ base: 'sm', sm: 'base' }}
              whiteSpace="nowrap"
            >
              {namespace === false
                ? `Description for ${title?.toString() ?? ''}`
                : t(getTKeys(namespace, title, 'description'))}
            </Text>
          </Box>
        </Flex>
      </Flex>
      <Flex align="center" gap="sm">
        {trailing}
      </Flex>
    </Flex>
  )
}
