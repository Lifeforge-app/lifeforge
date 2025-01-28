import MenuItem from '@components/buttons/HamburgerMenu/components/MenuItem'
import { Menu, MenuButton, MenuItems } from '@headlessui/react'
import useThemeColors from '@hooks/useThemeColor'
import { Icon } from '@iconify/react/dist/iconify.js'
import { useAuthContext } from '@providers/AuthProvider'
import { useGlobalStateContext } from '@providers/GlobalStateProvider'
import React from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'

function SidebarBottomBar(): React.ReactElement {
  const navigate = useNavigate()
  const { sidebarExpanded } = useGlobalStateContext()
  const { userData, getAvatarURL, logout } = useAuthContext()
  const { componentBgLighterWithHover } = useThemeColors()

  return (
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
          className="z-9991 w-[var(--button-width)] min-w-64 overflow-hidden overscroll-contain rounded-md border border-bg-200 bg-bg-100 shadow-lg outline-hidden transition duration-100 ease-out [--anchor-gap:8px] focus:outline-hidden data-closed:scale-95 data-closed:opacity-0 dark:border-bg-700 dark:bg-bg-800"
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
  )
}

export default SidebarBottomBar
