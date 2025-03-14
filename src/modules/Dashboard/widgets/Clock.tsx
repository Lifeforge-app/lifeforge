import clsx from 'clsx'
import moment from 'moment/min/moment-with-locales'
import { useRef, useState } from 'react'

import useComponentBg from '@hooks/useComponentBg'

export default function Clock() {
  const { componentBg } = useComponentBg()
  const [time, setTime] = useState(moment().format('HH:mm'))
  const [seocond, setSecond] = useState(moment().format('ss') as any)
  const ref = useRef<HTMLDivElement>(null)

  setInterval(() => {
    setTime(moment().format('HH:mm'))
    setSecond(moment().format('ss'))
  }, 1000)

  return (
    <div
      ref={ref}
      className={clsx(
        'shadow-custom flex size-full gap-4 rounded-lg p-4',
        componentBg,
        (ref.current?.offsetHeight ?? 0) < 160
          ? 'flex-between flex-row'
          : 'flex-col'
      )}
    >
      <div className="flex flex-col">
        <span className="font-medium">
          {Intl.DateTimeFormat()
            .resolvedOptions()
            .timeZone.split('/')[1]
            .replace('_', ' ')}
        </span>
        <span className="text-bg-500">
          UTC {moment().utcOffset() > 0 ? '+' : ''}
          {moment().utcOffset() / 60}
        </span>
      </div>
      <span
        className={clsx(
          'flex items-end font-semibold tracking-wider',
          (ref.current?.offsetHeight ?? 0) < 160
            ? 'text-4xl'
            : 'my-auto justify-center text-center text-6xl'
        )}
      >
        {time}
        <span
          className={clsx(
            'text-bg-500 -mb-0.5 ml-1 inline-block w-9',
            (ref.current?.offsetHeight ?? 0) < 160 ? 'text-2xl' : 'text-4xl'
          )}
        >
          {seocond}
        </span>
      </span>
    </div>
  )
}
