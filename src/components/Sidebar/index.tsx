import { Icon } from '@iconify/react'
import moment from 'moment'
import React, { useMemo } from 'react'
import useThemeColors from '@hooks/useThemeColor'
import { useAuthContext } from '@providers/AuthProvider'
import { useGlobalStateContext } from '@providers/GlobalStateProvider'
import { isLightColor } from '@utils/colors'
import { addNumberSuffix } from '@utils/strings'
import SidebarHeader from './components/SidebarHeader'
import SidebarItems from './components/SidebarItems'

function Sidebar(): React.ReactElement {
  const { sidebarExpanded } = useGlobalStateContext()
  const { theme } = useThemeColors()
  const { userData } = useAuthContext()
  const eventType = useMemo(() => {
    if (moment().format('MM-DD') === '08-31') return 'merdeka'

    if (Boolean(userData) && userData?.dateOfBirth !== '') {
      if (
        moment(userData.dateOfBirth).format('MM-DD') ===
        moment().format('MM-DD')
      ) {
        return 'birthday'
      }
    }
    return ''
  }, [userData])

  return (
    <aside
      className={`${
        sidebarExpanded
          ? 'w-full min-w-80 sm:w-1/2 lg:w-3/12 xl:w-1/5'
          : 'w-0 sm:w-[5.4rem]'
      } absolute left-0 top-0 z-[9990] flex h-full shrink-0 flex-col overflow-hidden rounded-r-2xl bg-bg-50 shadow-custom backdrop-blur-sm transition-all duration-300 dark:bg-bg-900 lg:relative lg:bg-bg-50/50 lg:backdrop-blur-sm lg:dark:bg-bg-900/50`}
    >
      {sidebarExpanded && eventType !== '' && (
        <div
          className={`flex-between flex w-full gap-2 whitespace-nowrap rounded-tr-2xl bg-custom-500 p-4 text-lg font-medium ${
            isLightColor(theme ?? '#000000') ? 'text-bg-800' : 'text-bg-50'
          }`}
        >
          <div className="flex w-full min-w-0 items-center gap-3">
            <Icon
              icon="mingcute:celebrate-line"
              className="shrink-0 text-2xl"
            />
            <p className="line-clamp-2 w-full whitespace-normal">
              Happy{' '}
              {eventType === 'birthday'
                ? addNumberSuffix(
                    moment().year() - moment(userData.dateOfBirth).year()
                  )
                : ''}{' '}
              Birthday, <br />{' '}
              {eventType === 'merdeka' ? 'Malaysia' : userData.name}!
            </p>
          </div>
          {eventType === 'merdeka' && (
            <Icon
              icon="emojione-monotone:flag-for-malaysia"
              className="text-2xl"
            />
          )}
        </div>
      )}

      <SidebarHeader />
      <SidebarItems />
    </aside>
  )
}

export default Sidebar
