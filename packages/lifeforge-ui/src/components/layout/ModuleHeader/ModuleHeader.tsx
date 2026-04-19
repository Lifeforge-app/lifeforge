import { Menu, MenuButton, MenuItems } from '@headlessui/react'
import { Icon } from '@iconify/react'
import { useTranslation } from 'react-i18next'
import { useMainSidebarState } from 'shared'
import { useModuleHeaderState } from 'shared'

import { Button } from '@components/inputs'
import { Box, Flex, Text } from '@components/primitives'

import ContextMenu from '../../overlays/ContextMenu'
import * as styles from './ModuleHeader.css'

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

function ModuleHeader({
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
  const { title: innerTitle, icon: innerIcon } = useModuleHeaderState()

  title = title ?? innerTitle
  icon = icon ?? innerIcon

  const { t } = useTranslation([
    `apps.${title}`,
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
            className={styles.iconWrapper}
            justify="center"
            rounded="lg"
          >
            <Icon className={styles.moduleIcon} icon={icon} />
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
              <Text
                color="bg-500"
                size={{ base: 'sm', sm: 'base' }}
                style={{ minWidth: 0 }}
                weight="medium"
              >
                {totalItems !== undefined
                  ? `(${totalItems.toLocaleString()})`
                  : ''}
              </Text>
            </Flex>
          </Text>
          <Text
            truncate
            color="bg-500"
            size={{ base: 'sm', sm: 'base' }}
            style={{ minWidth: 0, width: '100%' }}
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
        </Flex>
      </Flex>
      <Flex align="center" gap="sm">
        {actionButton}
        {tips && (
          <Box
            asChild
            display={{ base: 'none', md: 'block' }}
            position="relative"
            style={{ zIndex: 50 }}
          >
            <Menu as="div">
              <Box asChild p="md" rounded="lg">
                <MenuButton className={styles.menuButton}>
                  <Icon
                    className={styles.tipsIcon}
                    icon="tabler:question-circle"
                  />
                </MenuButton>
              </Box>
              <MenuItems
                transition
                anchor="bottom end"
                className={styles.menuItems}
              >
                <Text asChild color={{ base: 'bg-800', dark: 'bg-200' }}>
                  <Flex align="center" gap="sm" p="md">
                    <Icon
                      className={styles.tipsHeaderIcon}
                      icon="tabler:question-circle"
                    />
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
            </Menu>
          </Box>
        )}
        {customElement}
        {contextMenuProps && <ContextMenu {...contextMenuProps} />}
      </Flex>
    </Flex>
  )
}

export default ModuleHeader
