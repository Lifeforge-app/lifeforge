import { Menu, MenuButton, MenuItems } from '@headlessui/react'

import { useModuleMetadata } from '@lifeforge/federation'
import { useModuleTranslation } from '@lifeforge/localization'

import { Button } from '@/components/inputs'
import { Box, Flex, Icon, Text, Transition } from '@/components/primitives'
import { colorWithOpacity } from '@/system'

import { useMainSidebarState } from '../../../providers'
import { ContextMenu } from '../../overlays/ContextMenu'

interface ModuleHeaderProps {
  icon?: string
  title?: string
  totalItems?: number
  tips?:
    | string
    | {
        title: string
        content: React.ReactNode
      }
  contextMenuProps?: React.ComponentProps<typeof ContextMenu>
  actionButton?: React.ReactNode
  customElement?: React.ReactNode
  namespace?: string
  tKey?: string
}

export function ModuleHeader({
  icon,
  title,
  totalItems,
  tips,
  contextMenuProps,
  actionButton,
  customElement,
  namespace,
  tKey
}: ModuleHeaderProps) {
  const { title: innerTitle, icon: innerIcon } = useModuleMetadata()

  title = title ?? innerTitle
  icon = icon ?? innerIcon

  const { t } = useModuleTranslation([
    `common.${title}`,
    'common.misc',
    namespace ?? ''
  ])
  
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
                {t([
                  `${namespace}:${tKey}.${title}.title`,
                  `${namespace}:${title}.title`,
                  `apps.${title}:title`,
                  `common.${title}:title`,
                  'common.misc:title',
                  'title',
                  title?.toString() ?? ''
                ])}
              </Text>
              <Box asChild minWidth="0">
                <Text
                  color="muted"
                  size={{ base: 'sm', sm: 'base' }}
                  weight="medium"
                >
                  {totalItems !== undefined
                    ? `(${totalItems.toLocaleString()})`
                    : ''}
                </Text>
              </Box>
            </Flex>
          </Text>
          <Box asChild minWidth="0" width="100%">
            <Text
              truncate
              color="muted"
              size={{ base: 'sm', sm: 'base' }}
              whiteSpace="nowrap"
            >
              {t([
                `${namespace}:${tKey}.${title}.description`,
                `${namespace}:${title}.description`,
                `apps.${title}:description`,
                `common.${title}:description`,
                'common.misc:description',
                'description',
                `Description for ${title?.toString() ?? ''}`
              ])}
            </Text>
          </Box>
        </Flex>
      </Flex>
      <Flex align="center" gap="sm">
        {actionButton}
        {tips && (
          <Box
            asChild
            display={{ base: 'none', md: 'block' }}
            overflow="hidden"
            position="relative"
            r="md"
            style={{ zIndex: 50 }}
            width="24em"
          >
            <Menu as="div">
              <Transition>
                <Box
                  asChild
                  bg={{
                    hover: 'bg-100',
                    darkHover: 'bg-900'
                  }}
                  p="md"
                  r="lg"
                >
                  <Text
                    asChild
                    color={{
                      base: 'bg-500',
                      hover: 'bg-800',
                      darkHover: 'bg-50'
                    }}
                  >
                    <MenuButton>
                      <Icon icon="tabler:question-circle" />
                    </MenuButton>
                  </Text>
                </Box>
              </Transition>
              <Transition>
                <Box
                  asChild
                  shadow
                  bg={{ base: 'bg-100', dark: 'bg-800' }}
                  style={{
                    // @ts-expect-error - CSS variables
                    '--anchor-gap': '8px'
                  }}
                >
                  <MenuItems transition anchor="bottom end">
                    <Text asChild color={{ base: 'bg-800', dark: 'bg-200' }}>
                      <Flex align="center" gap="sm" p="md">
                        <Icon icon="tabler:question-circle" size="1.5rem" />
                        <Text as="h2" size="lg" weight="semibold">
                          {typeof tips === 'string'
                            ? t('common.misc:tipsAndTricks')
                            : tips.title}
                        </Text>
                      </Flex>
                    </Text>
                    <Text as="div" color={{ base: 'bg-500' }} p="md" pt="none">
                      {typeof tips === 'string' ? tips : tips.content}
                    </Text>
                  </MenuItems>
                </Box>
              </Transition>
            </Menu>
          </Box>
        )}
        {customElement}
        {contextMenuProps && <ContextMenu {...contextMenuProps} />}
      </Flex>
    </Flex>
  )
}
