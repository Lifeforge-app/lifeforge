import { Menu, MenuButton, MenuItems } from '@headlessui/react'
import { Icon } from '@iconify/react'
import clsx from 'clsx'
import { MenuItem } from 'lifeforge-ui'
import { useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'
import { useSidebarState } from 'shared'

import { useAuth } from '../../../providers/AuthProvider'

function SidebarBottomBar() {
  const navigate = useNavigate()

  const { sidebarExpanded, toggleSidebar } = useSidebarState()

  const { userData, getAvatarURL, logout } = useAuth()

  const handleNavigateToAccountSettings = useCallback(() => {
    if (window.innerWidth < 1024) {
      toggleSidebar()
    }
    navigate('/account')
  }, [navigate, toggleSidebar])

  const handleLoggingOut = useCallback(() => {
    logout()
    toast.warning('Logged out successfully!')
  }, [logout])

  if (!userData) return <></>

  const memoizedMenu = useMemo(
    () => (
      <Menu as="div" className="relative w-full min-w-0">
        <MenuButton
          className={clsx(
            'flex-between shadow-custom w-full min-w-0 gap-8 rounded-md p-4 text-left',
            sidebarExpanded &&
              'bg-bg-200/50 dark:bg-bg-800/50 dark:hover:bg-bg-800/80 hover:bg-bg-200/50 transition-all'
          )}
        >
          <div className="flex-center w-full min-w-0 gap-3">
            <div className="bg-bg-100 shadow-custom dark:bg-bg-800 flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full">
              {userData.avatar !== '' ? (
                <img
                  alt=""
                  className="size-full object-cover"
                  src={getAvatarURL()}
                />
              ) : (
                <Icon className="text-bg-500 text-xl" icon="tabler:user" />
              )}
            </div>
            <div
              className={clsx(
                'w-full min-w-0 flex-col items-start',
                sidebarExpanded ? 'flex' : 'hidden'
              )}
            >
              <div className="font-semibold">{userData?.name}</div>
              <div className="text-bg-500 w-full min-w-0 truncate text-sm">
                {userData?.email}
              </div>
            </div>
          </div>
          <Icon
            className={clsx(
              'text-bg-500 size-5 shrink-0 stroke-[2px]',
              sidebarExpanded ? 'flex' : 'hidden'
            )}
            icon="ph:caret-up-down-bold"
          />
        </MenuButton>
        <MenuItems
          transition
          anchor="top start"
          className="border-bg-200 bg-bg-100 dark:border-bg-700 dark:bg-bg-800 z-9991 w-[var(--button-width)] min-w-64 overflow-hidden overscroll-contain rounded-md border shadow-lg outline-hidden transition duration-100 ease-out [--anchor-gap:8px] focus:outline-hidden data-closed:scale-95 data-closed:opacity-0"
        >
          <div className="py-1">
            <MenuItem
              icon="tabler:user-cog"
              namespace="common.sidebar"
              text="Account settings"
              onClick={handleNavigateToAccountSettings}
            />
            <MenuItem
              isRed
              icon="tabler:logout"
              namespace="common.sidebar"
              text="Sign out"
              onClick={handleLoggingOut}
            />
          </div>
        </MenuItems>
      </Menu>
    ),
    [
      sidebarExpanded,
      userData,
      getAvatarURL,
      handleNavigateToAccountSettings,
      handleLoggingOut
    ]
  )

  return (
    <div
      className={clsx(
        'flex-center w-full min-w-0 pt-0 pb-4',
        sidebarExpanded && 'px-4'
      )}
    >
      {memoizedMenu}
    </div>
  )
}

export default SidebarBottomBar
