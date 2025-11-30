import { Icon } from '@iconify/react'
import clsx from 'clsx'
import { ContextMenu, ContextMenuItem } from 'lifeforge-ui'
import { useCallback } from 'react'
import { toast } from 'react-toastify'
import { useNavigate } from 'shared'
import { useMainSidebarState } from 'shared'
import { useAuth } from 'shared'

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
    <div
      className={clsx(
        'flex-center w-full min-w-0 pt-0 pb-4',
        sidebarExpanded && 'px-4'
      )}
    >
      <ContextMenu
        buttonComponent={
          <button
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
          </button>
        }
        classNames={{
          wrapper: 'w-full'
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
    </div>
  )
}

export default SidebarBottomBar
