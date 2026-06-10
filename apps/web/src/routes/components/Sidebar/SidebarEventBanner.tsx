import dayjs from 'dayjs'
import { useMemo } from 'react'
import tinycolor from 'tinycolor2'

import { useAuth } from '@lifeforge/api'
import {
  COLORS,
  Flex,
  Icon,
  Text,
  useMainSidebarState,
  usePersonalization
} from '@lifeforge/ui'

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

export default function SidebarEventBanner() {
  const { sidebarExpanded } = useMainSidebarState()
  const { derivedThemeColor: themeColor } = usePersonalization()
  const { userData } = useAuth()
  
const eventType = useMemo(
    () => getEventType(userData?.dateOfBirth),
    [userData?.dateOfBirth]
  )

  if (!sidebarExpanded || !eventType || !userData) return <></>

  const bgColor =
    eventType === 'christmas'
      ? {
          backgroundColor: '#f14e63',
          color: COLORS['bg-100']
        }
      : {
          backgroundColor: COLORS['custom-500'],
          color: tinycolor(themeColor).isLight()
            ? COLORS['bg-800']
            : COLORS['bg-100']
        }

  return (
    <Text asChild size="lg" weight="medium" whiteSpace="nowrap">
      <Flex
        align="center"
        gap="sm"
        justify="between"
        p="md"
        rtr="2xl"
        style={bgColor}
      >
        <Flex align="center" gap="sm">
          {eventType === 'christmas' && (
            <Icon icon="mingcute:christmas-hat-line" size="1.5em" />
          )}
          <Text as="p" lineClamp={2} whiteSpace="normal">
            {getEventMessage(eventType, userData.name, userData.dateOfBirth)}
          </Text>
        </Flex>
        <Icon icon={getEventIcon(eventType)} size="1.5em" />
      </Flex>
    </Text>
  )
}
