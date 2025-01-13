import { Menu, MenuButton, MenuItems } from '@headlessui/react'
import { Icon } from '@iconify/react/dist/iconify.js'
import { useDebounce } from '@uidotdev/usehooks'
import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'
import MenuItem from '@components/ButtonsAndInputs/HamburgerMenu/MenuItem'
import useThemeColors from '@hooks/useThemeColor'
import { useAuthContext } from '@providers/AuthProvider'
import { useGlobalStateContext } from '@providers/GlobalStateProvider'
import SidebarEventBanner from './components/SidebarEventBanner'
import SidebarHeader from './components/SidebarHeader'
import SidebarItem from './components/SidebarItem'
import SidebarItems from './components/SidebarItems'

function Sidebar(): React.ReactElement {
  const navigate = useNavigate()
  const { componentBgLighterWithHover } = useThemeColors()
  const { userData, getAvatarURL, logout } = useAuthContext()
  const { sidebarExpanded, toggleSidebar } = useGlobalStateContext()
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  return (
    <>
      <aside
        className={`${
          sidebarExpanded
            ? 'w-full min-w-80 sm:w-1/2 lg:w-3/12 xl:w-1/5'
            : 'w-0 min-w-0 sm:w-[5.4rem]'
        } absolute left-0 top-0 z-[9990] flex h-full shrink-0 flex-col overflow-hidden rounded-r-2xl bg-bg-50 shadow-custom backdrop-blur-sm transition-all duration-300 dark:bg-bg-900 lg:relative lg:bg-bg-50/50 lg:backdrop-blur-sm lg:dark:bg-bg-900/50`}
      >
        <SidebarEventBanner />
        <SidebarHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <SidebarItems query={debouncedSearchQuery} />
        {!sidebarExpanded && (
          <SidebarItem
            active={false}
            name=""
            onClick={toggleSidebar}
            icon="tabler:layout-sidebar-left-expand"
          />
        )}
        <div
          className={`flex-center w-full min-w-0 pb-4 pt-0 ${
            sidebarExpanded && 'px-4'
          }`}
        >
          <Menu as="div" className="relative w-full min-w-0">
            <MenuButton
              className={`flex-between w-full min-w-0 gap-8 text-left ${
                sidebarExpanded && componentBgLighterWithHover
              } rounded-md p-4`}
            >
              <div className="flex-center w-full min-w-0 gap-3">
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
                <div
                  className={`${
                    sidebarExpanded ? 'flex' : 'hidden'
                  } w-full min-w-0 flex-col items-start`}
                >
                  <div className="font-semibold ">{userData?.name}</div>
                  <div className="w-full min-w-0 truncate text-sm text-bg-500">
                    {userData?.email}
                  </div>
                </div>
              </div>
              <Icon
                icon="ph:caret-up-down-bold"
                className={`size-5 shrink-0 stroke-[2px] text-bg-500 ${
                  sidebarExpanded ? 'flex' : 'hidden'
                }`}
              />
            </MenuButton>
            <MenuItems
              transition
              anchor="top start"
              className="z-[9991] w-[var(--button-width)] min-w-64 overflow-hidden overscroll-contain rounded-md border border-bg-200 bg-bg-100 shadow-lg outline-none transition duration-100 ease-out [--anchor-gap:8px] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0 dark:border-bg-700 dark:bg-bg-800"
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
      </aside>
    </>
  )
}

export default Sidebar
