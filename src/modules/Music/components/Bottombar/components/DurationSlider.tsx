import moment from 'moment'
import React from 'react'
import { useMusicContext } from '@providers/MusicProvider'

function DurationSlider(): React.ReactElement {
  const { audio, currentDuration, setCurrentDuration, currentMusic } =
    useMusicContext()

  if (currentMusic === null) {
    return <></>
  }

  return (
    <div className="flex w-full items-center gap-2 text-sm">
      <span className="-mt-0.5 text-bg-500">
        {moment
          .utc(moment.duration(+currentDuration, 'seconds').asMilliseconds())
          .format(+currentDuration >= 3600 ? 'H:mm:ss' : 'm:ss')}
      </span>
      <input
        type="range"
        onChange={e => {
          audio.currentTime = +e.target.value
          setCurrentDuration(+e.target.value)
        }}
        className="main h-1 w-full cursor-pointer overflow-hidden rounded-full bg-bg-200 dark:bg-bg-700"
        value={currentDuration}
        max={currentMusic.duration}
      ></input>
      <span className="-mt-0.5 text-bg-500">
        {moment
          .utc(
            moment.duration(+currentMusic.duration, 'seconds').asMilliseconds()
          )
          .format(+currentMusic.duration >= 3600 ? 'H:mm:ss' : 'm:ss')}
      </span>
    </div>
  )
}

export default DurationSlider
