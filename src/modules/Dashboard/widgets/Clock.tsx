import moment from 'moment/min/moment-with-locales'
import React, { useRef, useState } from 'react'

export default function Clock(): React.ReactElement {
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
      className={`flex size-full gap-4 rounded-lg bg-bg-50 p-4 shadow-custom dark:bg-bg-900 ${
        (ref.current?.offsetHeight ?? 0) < 160
          ? 'flex-row flex-between'
          : 'flex-col'
      }`}
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
        className={`flex items-end font-semibold tracking-wider ${
          (ref.current?.offsetHeight ?? 0) < 160
            ? 'text-4xl'
            : 'my-auto justify-center text-center text-6xl'
        }`}
      >
        {time}
        <span
          className={`-mb-0.5 ml-1 inline-block w-9 ${
            (ref.current?.offsetHeight ?? 0) < 160 ? 'text-2xl' : 'text-4xl'
          } text-bg-500`}
        >
          {seocond}
        </span>
      </span>
    </div>
  )
}
