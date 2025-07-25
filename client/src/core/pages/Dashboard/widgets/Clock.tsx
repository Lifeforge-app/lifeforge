import clsx from 'clsx'
import dayjs from 'dayjs'
import { useRef, useState } from 'react'

function Clock() {
  const [time, setTime] = useState(dayjs().format('HH:mm'))

  const [second, setSecond] = useState(dayjs().format('ss') as any)

  const ref = useRef<HTMLDivElement>(null)

  setInterval(() => {
    setTime(dayjs().format('HH:mm'))
    setSecond(dayjs().format('ss'))
  }, 1000)

  return (
    <div
      ref={ref}
      className={clsx(
        'shadow-custom component-bg flex size-full gap-3 rounded-lg p-4',
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
          UTC {dayjs().utcOffset() > 0 ? '+' : ''}
          {dayjs().utcOffset() / 60}
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
          {second}
        </span>
      </span>
    </div>
  )
}

export default Clock
