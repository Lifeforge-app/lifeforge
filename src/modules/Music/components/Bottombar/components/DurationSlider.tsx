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
        className="main h-1 w-full cursor-pointer overflow-hidden rounded-full bg-bg-200 dark:bg-bg-700"
        max={currentMusic.duration}
        style={{
          backgroundSize: `${
            (+currentDuration / +currentMusic.duration) * 100
          }% 100%`
        }}
        type="range"
        value={currentDuration}
        onChange={e => {
          audio.currentTime = +e.target.value
          setCurrentDuration(+e.target.value)
        }}
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
