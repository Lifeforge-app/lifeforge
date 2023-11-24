import React, { Fragment, useContext } from 'react'
import { Icon } from '@iconify/react'
import { GlobalStateContext } from '../providers/GlobalStateProvider'
import { AuthContext } from '../providers/AuthProvider'
import { Menu, Transition } from '@headlessui/react'
import { toast } from 'react-toastify'

export default function Header(): React.JSX.Element {
  const { sidebarExpanded, toggleSidebar } = useContext(GlobalStateContext)
  const { userData, getAvatarURL, logout } = useContext(AuthContext)

  return (
    <header className="flex w-full items-center justify-between gap-8 p-12">
      <div className="flex w-full items-center gap-4">
        {!sidebarExpanded && (
          <button
            onClick={toggleSidebar}
            className="rounded-lg p-4 text-neutral-500 transition-all hover:bg-neutral-800 hover:text-neutral-100"
          >
            <Icon icon="tabler:menu" className="text-2xl" />
          </button>
        )}
        <div className="flex w-full items-center gap-4 rounded-lg bg-neutral-800/50 p-4">
          <Icon icon="tabler:search" className="h-5 w-5 text-neutral-500" />
          <input
            type="text"
            placeholder="Quick navigate & search ... (Press / to focus)"
            className="w-full bg-transparent text-neutral-100 placeholder:text-neutral-500 focus:outline-none"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative rounded-lg p-4 text-neutral-500 transition-all hover:bg-neutral-800 hover:text-neutral-100">
          <Icon icon="tabler:bell" className="text-2xl" />
          <div className="absolute bottom-4 right-4 h-2 w-2 rounded-full bg-red-500" />
        </button>
        <Menu as="div" className="relative text-left">
          <Menu.Button className="flex items-center gap-3">
            <div className="h-9 w-9 overflow-hidden rounded-full bg-neutral-800">
              <img
                src={getAvatarURL()}
                alt="avatar"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col items-start">
              <div className="font-semibold text-neutral-50">
                {userData?.name}
              </div>
              <div className="text-sm text-neutral-500">{userData?.email}</div>
            </div>
            <Icon
              icon="tabler:chevron-down"
              className="stroke-[2px] text-neutral-400"
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
            <Menu.Items className="absolute right-0 mt-4 w-56 overflow-hidden rounded-lg bg-neutral-800 shadow-lg focus:outline-none">
              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#"
                      className={`${
                        active
                          ? 'bg-neutral-700/50 text-neutral-100'
                          : 'text-neutral-400'
                      } flex w-full gap-4 p-6 text-left font-medium leading-5`}
                    >
                      <Icon icon="tabler:user-cog" className="h-5 w-5" />
                      Account settings
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => {
                        logout()
                        toast.warning('Logged out successfully!')
                      }}
                      className={`${
                        active
                          ? 'bg-neutral-700 text-rose-500'
                          : 'text-neutral-400'
                      } flex w-full items-center gap-4 p-6 text-left leading-5`}
                    >
                      <Icon icon="tabler:logout" className="h-5 w-5" />
                      Sign out
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </header>
  )
}
