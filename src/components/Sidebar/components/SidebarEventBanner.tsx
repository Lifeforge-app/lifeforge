import { Icon } from '@iconify/react/dist/iconify.js'
import moment from 'moment'
import React, { useMemo } from 'react'
import useThemeColors from '@hooks/useThemeColor'
import { useAuthContext } from '@providers/AuthProvider'
import { useGlobalStateContext } from '@providers/GlobalStateProvider'
import { isLightColor } from '@utils/colors'
import { addNumberSuffix } from '@utils/strings'

function SidebarEventBanner(): React.ReactElement {
  const { sidebarExpanded } = useGlobalStateContext()
  const { theme } = useThemeColors()
  const { userData } = useAuthContext()

  const eventType = useMemo(() => {
    switch (moment().format('MM-DD')) {
      case '08-31':
        return 'merdeka'
      case '12-25':
        return 'christmas'
      case moment(userData.dateOfBirth).format('MM-DD'):
        return 'birthday'
      default:
        return ''
    }
  }, [userData])

  return (
    <>
      {sidebarExpanded && eventType !== '' && (
        <div
          className={`flex-between flex w-full gap-2 whitespace-nowrap rounded-tr-2xl ${
            eventType === 'christmas'
              ? 'bg-[#f14e63] !text-bg-100'
              : 'bg-custom-500'
          } p-4 text-lg font-medium ${
            isLightColor(theme ?? '#000000') ? 'text-bg-800' : 'text-bg-50'
          }`}
        >
          <div className="flex w-full min-w-0 items-center gap-3">
            <Icon
              icon="mingcute:christmas-hat-line"
              className="shrink-0 text-2xl"
            />
            <p className="line-clamp-2 w-full whitespace-normal">
              {eventType === 'christmas' ? (
                'Merry Christmas!'
              ) : (
                <>
                  {}Happy{' '}
                  {eventType === 'birthday'
                    ? addNumberSuffix(
                        moment().year() - moment(userData.dateOfBirth).year()
                      )
                    : ''}{' '}
                  Birthday, <br />{' '}
                  {eventType === 'merdeka' ? 'Malaysia' : userData.name}!
                </>
              )}
            </p>
          </div>
          {eventType === 'merdeka' ? (
            <Icon
              icon="emojione-monotone:flag-for-malaysia"
              className="text-2xl"
            />
          ) : eventType === 'christmas' ? (
            <Icon icon="tabler:christmas-ball" className="text-2xl" />
          ) : (
            ''
          )}
        </div>
      )}
    </>
  )
}

export default SidebarEventBanner
