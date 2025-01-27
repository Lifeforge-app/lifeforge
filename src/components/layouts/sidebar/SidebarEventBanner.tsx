import { Icon } from '@iconify/react'
import moment from 'moment'
import React, { useMemo } from 'react'
import useThemeColors from '@hooks/useThemeColor'
import { useAuthContext } from '@providers/AuthProvider'
import { useGlobalStateContext } from '@providers/GlobalStateProvider'
import { isLightColor } from '@utils/colors'
import { addNumberSuffix } from '@utils/strings'

const getEventType = (userDOB: string): string => {
  const today = moment().format('MM-DD')
  if (today === '08-31') return 'merdeka'
  if (today === '12-25') return 'christmas'
  if (moment(userDOB).format('MM-DD') === today) return 'birthday'
  return ''
}

const getEventMessage = (
  eventType: string,
  userName: string,
  userDOB: string
) => {
  switch (eventType) {
    case 'christmas':
      return 'Merry Christmas!'
    case 'birthday':
      return (
        <>
          Happy {addNumberSuffix(moment().year() - moment(userDOB).year())}{' '}
          Birthday, <br />
          {userName}!
        </>
      )
    case 'merdeka':
      return 'Happy Birthday, Malaysia!'
    default:
      return ''
  }
}

const getEventIcon = (eventType: string) => {
  const iconMap: Record<string, string> = {
    merdeka: 'emojione-monotone:flag-for-malaysia',
    christmas: 'tabler:christmas-ball',
    birthday: 'mingcute:gift-2-line'
  }
  return iconMap[eventType] || ''
}

const SidebarEventBanner = (): React.ReactElement => {
  const { sidebarExpanded } = useGlobalStateContext()
  const { theme } = useThemeColors()
  const { userData } = useAuthContext()

  const eventType = useMemo(
    () => getEventType(userData.dateOfBirth),
    [userData.dateOfBirth]
  )

  if (!sidebarExpanded || !eventType) return <></>

  const themeColor = theme ?? '#000000'
  const textColor = isLightColor(themeColor) ? 'text-bg-800' : 'text-bg-50'
  const bgColor =
    eventType === 'christmas' ? 'bg-[#f14e63] !text-bg-100' : 'bg-custom-500'

  return (
    <div
      className={`flex-between flex w-full gap-2 whitespace-nowrap rounded-tr-2xl ${bgColor} p-4 text-lg font-medium ${textColor}`}
    >
      <div className="flex w-full min-w-0 items-center gap-3">
        {eventType === 'christmas' && (
          <Icon
            icon="mingcute:christmas-hat-line"
            className="shrink-0 text-2xl"
          />
        )}
        <p className="line-clamp-2 w-full whitespace-normal">
          {getEventMessage(eventType, userData.name, userData.dateOfBirth)}
        </p>
      </div>
      <Icon icon={getEventIcon(eventType)} className="text-2xl" />
    </div>
  )
}

export default SidebarEventBanner
