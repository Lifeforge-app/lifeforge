import { Menu, Transition } from '@headlessui/react'
import { Icon } from '@iconify/react'
import React, { Fragment } from 'react'
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
        subSidebarExpanded ? '-top-32 lg:top-0' : 'top-0'
      } absolute z-[9990] flex h-24 w-full min-w-0 flex-between gap-8 px-4 pl-0 transition-all sm:h-32 sm:px-12`}
    >
      <div className="flex w-full items-center gap-4">
        {!sidebarExpanded && (
          <button
            onClick={toggleSidebar}
            className="rounded-lg p-4 text-bg-500 transition-all hover:bg-bg-200 dark:hover:bg-bg-800 dark:hover:text-bg-100"
          >
            <Icon icon="tabler:menu" className="text-2xl" />
          </button>
        )}
        <QuickActions />
      </div>
      <div className="flex items-center">
        <button className="relative flex rounded-lg p-4 text-bg-500 transition-all hover:bg-bg-200/50 hover:text-bg-800 dark:hover:bg-bg-800 lg:hidden">
          <Icon icon="tabler:search" className="text-2xl" />
        </button>
        <button className="relative rounded-lg p-4 text-bg-500 transition-all hover:bg-bg-200/50 hover:text-bg-800 dark:hover:bg-bg-800">
          <Icon icon="tabler:bell" className="text-2xl" />
          <div className="absolute bottom-4 right-4 size-2 rounded-full bg-red-500" />
        </button>
        <Menu as="div" className="relative ml-4 text-left">
          <Menu.Button className="flex items-center gap-3">
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
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-4 w-56 overflow-hidden rounded-lg bg-bg-100 shadow-lg focus:outline-none dark:bg-bg-800">
              <div className="py-1">
                <MenuItem
                  preventDefault={false}
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
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </header>
  )
}
