import clsx from 'clsx'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { type WidgetConfig } from 'shared'

function Clock({ dimension: { h } }: { dimension: { w: number; h: number } }) {
  const [time, setTime] = useState(dayjs().format('HH:mm'))

  const [second, setSecond] = useState(dayjs().format('ss') as any)

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(dayjs().format('HH:mm'))
      setSecond(dayjs().format('ss'))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className={clsx(
        'shadow-custom component-bg border-bg-500/20 flex size-full gap-6 rounded-lg p-4 in-[.bordered]:border-2',
        h < 2
          ? 'items-center justify-center min-[488px]:justify-between'
          : 'flex-col'
      )}
    >
      <div
        className={clsx(
          'flex-col',
          h === 1 ? 'hidden min-[488px]:flex' : 'flex'
        )}
      >
        <span className="font-medium">
          {Intl.DateTimeFormat()
            .resolvedOptions()
            .timeZone.split('/')[1]
            .replace('_', ' ')}
        </span>
        <span className="text-bg-500">
          UTC {dayjs().utcOffset() > 0 ? '+' : ''}
          {dayjs().utcOffset() / 60}
        </span>
      </div>
      <span
        className={clsx(
          'flex items-end font-semibold tracking-wider',
          h < 2
            ? 'text-4xl'
            : 'my-auto justify-center text-center text-4xl min-[520px]:text-6xl'
        )}
      >
        {time}
        <span
          className={clsx(
            'text-bg-500 -mb-0.5 ml-1 inline-block w-9',
            h < 2 ? 'text-2xl' : 'text-2xl min-[520px]:text-4xl'
          )}
        >
          {second}
        </span>
      </span>
    </div>
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
