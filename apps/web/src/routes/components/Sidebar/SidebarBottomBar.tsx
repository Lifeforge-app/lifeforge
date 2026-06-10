import { useCallback } from 'react'
import { useNavigate } from 'react-router'

import { useAuth } from '@lifeforge/api'
import {
  Box,
  Card,
  ContextMenu,
  ContextMenuItem,
  Flex,
  Icon,
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
    <Flex centered pb="md" px={sidebarExpanded ? 'lg' : 'none'} width="100%">
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
                <Flex
                  centered
                  shadow
                  bg={{
                    base: 'bg-100',
                    dark: 'bg-700'
                  }}
                  flexShrink="0"
                  height="2.5rem"
                  overflow="hidden"
                  r="full"
                  width="2.5rem"
                >
                  {userData.avatar !== '' ? (
                    <Box
                      asChild
                      height="100%"
                      style={{
                        objectFit: 'cover'
                      }}
                      width="100%"
                    >
                      <img alt="" src={getAvatarURL()} />
                    </Box>
                  ) : (
                    <Icon color="muted" icon="tabler:user" />
                  )}
                </Flex>
                <Flex
                  direction="column"
                  display={sidebarExpanded ? 'flex' : 'none'}
                  minWidth="0"
                >
                  <Text truncate align="left" weight="semibold">
                    {userData?.name}
                  </Text>
                  <Text truncate align="left" as="p" color="muted" size="sm">
                    {userData?.email}
                  </Text>
                </Flex>
              </Flex>
              {sidebarExpanded && (
                <Icon
                  color={{ base: 'bg-400', dark: 'bg-600' }}
                  display={sidebarExpanded ? 'flex' : 'none'}
                  icon="ph:caret-up-down-bold"
                />
              )}
            </Card>
          </Transition>
        }
        styles={{
          wrapper: {
            width: '100%'
          }
        }}
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
