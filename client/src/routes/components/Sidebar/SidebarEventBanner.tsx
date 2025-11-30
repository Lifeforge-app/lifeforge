import { Icon } from '@iconify/react'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import { useMainSidebarState } from 'shared'
import { usePersonalization } from 'shared'
import { useAuth } from 'shared'
import tinycolor from 'tinycolor2'

function addNumberSuffix(number: number): string {
  const suffixes = ['th', 'st', 'nd', 'rd']

  const v = number % 100

  return number + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0])
}

const getEventType = (userDOB: string | undefined): string => {
  const today = dayjs().format('MM-DD')

  if (today === '08-31') return 'merdeka'
  if (today === '12-25') return 'christmas'
  if (userDOB && dayjs(userDOB).format('MM-DD') === today) return 'birthday'

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
          Happy {addNumberSuffix(dayjs().year() - dayjs(userDOB).year())}{' '}
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

const SidebarEventBanner = () => {
  const { sidebarExpanded } = useMainSidebarState()

  const { derivedThemeColor: themeColor } = usePersonalization()

  const { userData } = useAuth()

  const eventType = useMemo(
    () => getEventType(userData?.dateOfBirth),
    [userData?.dateOfBirth]
  )

  if (!sidebarExpanded || !eventType || !userData) return <></>

  const textColor = tinycolor(themeColor).isLight()
    ? 'text-bg-800'
    : 'text-bg-50'

  const bgColor =
    eventType === 'christmas' ? 'bg-[#f14e63] text-bg-100!' : 'bg-custom-500'

  return (
    <div
      className={clsx(
        'flex-between flex w-full gap-2 rounded-tr-2xl p-4 text-lg font-medium whitespace-nowrap',
        bgColor,
        textColor
      )}
    >
      <div className="flex w-full min-w-0 items-center gap-3">
        {eventType === 'christmas' && (
          <Icon
            className="shrink-0 text-2xl"
            icon="mingcute:christmas-hat-line"
          />
        )}
        <p className="line-clamp-2 w-full whitespace-normal">
          {getEventMessage(eventType, userData.name, userData.dateOfBirth)}
        </p>
      </div>
      <Icon className="text-2xl" icon={getEventIcon(eventType)} />
    </div>
  )
}

export default SidebarEventBanner
