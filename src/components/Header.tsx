import { Menu, MenuButton, MenuItems } from '@headlessui/react'
import { Icon } from '@iconify/react'
import React from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'
import { useAuthContext } from '@providers/AuthProvider'
import { useGlobalStateContext } from '@providers/GlobalStateProvider'
import MenuItem from './ButtonsAndInputs/HamburgerMenu/MenuItem'
import QuickActions from './QuickActions'

export default function Header(): React.ReactElement {
  const { sidebarExpanded, toggleSidebar, subSidebarExpanded } =
    useGlobalStateContext()
  const { userData, getAvatarURL, logout } = useAuthContext()
  const navigate = useNavigate()

  return (
    <header
      className={`${
        subSidebarExpanded ? '!-top-24 lg:top-0' : 'top-0 z-[9989]'
      } absolute flex h-20 w-full min-w-0 items-center justify-between gap-8 px-4 pr-8 transition-all sm:h-28 sm:px-12`}
    >
      <div className="flex w-full items-center gap-4">
        {!sidebarExpanded && (
          <button
            onClick={toggleSidebar}
            className="rounded-lg p-4 text-bg-500 transition-all hover:bg-bg-200 dark:hover:bg-bg-800 dark:hover:text-bg-50"
          >
            <Icon icon="tabler:menu" className="text-2xl" />
          </button>
        )}
        <QuickActions />
      </div>
      <div className="flex items-center">
        <button className="relative flex rounded-lg p-4 text-bg-500 transition-all hover:bg-bg-100 hover:text-bg-800 dark:hover:bg-bg-800 lg:hidden">
          <Icon icon="tabler:search" className="text-2xl" />
        </button>
        <button className="relative rounded-lg p-4 text-bg-500 transition-all hover:bg-bg-100 hover:text-bg-800 dark:hover:bg-bg-800">
          <Icon icon="tabler:bell" className="text-2xl" />
          <div className="absolute bottom-4 right-4 size-2 rounded-full bg-red-500" />
        </button>
        <Menu as="div" className="relative ml-4 text-left">
          <MenuButton className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center overflow-hidden rounded-full bg-bg-100 dark:bg-bg-800">
              {userData.avatar !== '' ? (
                <img
                  src={getAvatarURL()}
                  alt=""
                  className="size-full object-cover"
                />
              ) : (
                <Icon icon="tabler:user" className="text-xl text-bg-500" />
              )}
            </div>
            <div className="hidden flex-col items-start md:flex">
              <div className="font-semibold ">{userData?.name}</div>
              <div className="text-sm text-bg-500">{userData?.email}</div>
            </div>
            <Icon
              icon="tabler:chevron-down"
              className="stroke-[2px] text-bg-500"
            />
          </MenuButton>
          <MenuItems
            transition
            anchor="bottom end"
            className="z-[9991] mt-2 w-[var(--button-width)] min-w-36 overflow-hidden overscroll-contain rounded-md border border-bg-200 bg-bg-100 shadow-lg outline-none transition duration-100 ease-out [--anchor-gap:8px] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0 dark:border-bg-700 dark:bg-bg-800"
          >
            <div className="py-1">
              <MenuItem
                onClick={() => {
                  navigate('/account')
                }}
                icon="tabler:user-cog"
                text="Account settings"
              />
              <MenuItem
                isRed
                onClick={() => {
                  logout()
                  toast.warning('Logged out successfully!')
                }}
                icon="tabler:logout"
                text="Sign out"
              />
            </div>
          </MenuItems>
        </Menu>
      </div>
    </header>
  )
}
