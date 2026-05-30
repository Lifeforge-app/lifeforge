import dayjs from 'dayjs'
import { useEffect, useState } from 'react'

import { type WidgetConfig } from '@lifeforge/shared'
import { Card, Flex, Text } from '@lifeforge/ui'

function Clock({ dimension: { h } }: { dimension: { w: number; h: number } }) {
  const [time, setTime] = useState(dayjs().format('HH:mm'))

  const [second, setSecond] = useState(dayjs().format('ss'))

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(dayjs().format('HH:mm'))
      setSecond(dayjs().format('ss'))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <Card
      align={h < 2 ? 'center' : undefined}
      direction={h < 2 ? 'row' : 'column'}
      gap="md"
      height="100%"
      justify={h < 2 ? { base: 'center', sm: 'between' } : undefined}
    >
      <Flex
        direction="column"
        display={h === 1 ? { base: 'none', sm: 'flex' } : 'flex'}
      >
        <Text weight="medium">
          {Intl.DateTimeFormat()
            .resolvedOptions()
            .timeZone.split('/')[1]
            .replace('_', ' ')}
        </Text>
        <Text color="muted">
          UTC {dayjs().utcOffset() > 0 ? '+' : ''}
          {dayjs().utcOffset() / 60}
        </Text>
      </Flex>
      <Text
        asChild
        style={{
          margin: h < 2 ? '0' : 'auto'
        }}
        tracking="wider"
        weight="semibold"
      >
        <Flex align="end">
          <Text size={h < 2 ? '4xl' : { base: '4xl', sm: '6xl' }}>{time}</Text>
          <Text
            color="muted"
            ml="xs"
            size={h < 2 ? '2xl' : { base: '2xl', sm: '4xl' }}
          >
            {second}
          </Text>
        </Flex>
      </Text>
    </Card>
  )
}

export default Clock

export const config: WidgetConfig = {
  id: 'clock',
  icon: 'tabler:clock',
  minW: 2,
  minH: 1,
  maxH: 2
}
