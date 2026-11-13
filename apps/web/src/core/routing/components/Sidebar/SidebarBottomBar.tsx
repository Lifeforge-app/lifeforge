import { useCallback } from 'react'
import { useNavigate } from 'react-router'

import { useAuth } from '@lifeforge/api'
import {
  Card,
  ContextMenu,
  ContextMenuItem,
  Flex,
  Icon,
  Image,
  Text,
  Transition,
  surface,
  toast,
  useMainSidebarState
} from '@lifeforge/ui'

function SidebarBottomBar() {
  const navigate = useNavigate()
  const { sidebarExpanded, toggleSidebar } = useMainSidebarState()
  const { userData, getAvatarURL, logout } = useAuth()

  const handleNavigateToAccountSettings = useCallback(() => {
    if (window.innerWidth < 1024) {
      toggleSidebar()
    }
    navigate('/account-settings')
  }, [navigate, toggleSidebar])
  const handleLoggingOut = useCallback(() => {
    logout()
    toast.warning('Logged out successfully!')
  }, [logout])

  if (!userData) return <></>

  return (
    <Flex centered pb="md" px={sidebarExpanded ? 'md' : 'none'} width="100%">
      <ContextMenu
        buttonComponent={
          <Transition>
            <Card
              align="center"
              as="button"
              bg={sidebarExpanded ? surface.lightInteractive : 'transparent'}
              direction="row"
              gap="xl"
              justify={sidebarExpanded ? 'between' : 'center'}
              width="100%"
            >
              <Flex centered gap="sm" minWidth="0">
                <Image
                  shadow
                  alt=""
                  bg={{ base: 'bg-100', dark: 'bg-700' }}
                  fallback={<Icon color="muted" icon="tabler:user" />}
                  fit="cover"
                  flexShrink="0"
                  height="2.5em"
                  r="full"
                  src={userData.avatar ? getAvatarURL() : undefined}
                  width="2.5em"
                />
                <Flex
                  direction="column"
                  display={sidebarExpanded ? 'flex' : 'none'}
                  minWidth="0"
                >
                  <Text truncate align="left" weight="semibold">
                    {userData.name}
                  </Text>
                  <Text truncate align="left" as="p" color="muted" size="sm">
                    {userData.email}
                  </Text>
                </Flex>
              </Flex>
              {sidebarExpanded && (
                <Icon
                  color={{ base: 'bg-400', dark: 'bg-600' }}
                  icon="ph:caret-up-down-bold"
                />
              )}
            </Card>
          </Transition>
        }
        width="100%"
      >
        <ContextMenuItem
          icon="tabler:user-cog"
          label="Account settings"
          namespace="common.sidebar"
          onClick={handleNavigateToAccountSettings}
        />
        <ContextMenuItem
          dangerous
          icon="tabler:logout"
          label="Sign out"
          namespace="common.sidebar"
          onClick={handleLoggingOut}
        />
      </ContextMenu>
    </Flex>
  )
}

export default SidebarBottomBar
