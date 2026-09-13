/* eslint-disable react-compiler/react-compiler */
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

import { useMusicContext } from '@/providers/MusicProvider'

dayjs.extend(duration)

function DurationSlider() {
  const { audio, currentDuration, setCurrentDuration, currentMusic } =
    useMusicContext()

  if (currentMusic === null) {
    return <></>
  }

  return (
    <div className="flex w-full items-center gap-2 text-sm">
      <span className="text-bg-500 -mt-0.5">
        {dayjs
          .duration(+currentDuration, 'seconds')
          .format(+currentDuration >= 3600 ? 'H:mm:ss' : 'm:ss')}
      </span>
      <input
        className="main bg-bg-200 dark:bg-bg-700 h-1 w-full cursor-pointer overflow-hidden rounded-full"
        max={currentMusic.duration}
        style={{
          backgroundSize: `${
            (+currentDuration / +currentMusic.duration) * 100
          }% 100%`
        }}
        type="range"
        value={currentDuration}
        onChange={e => {
          audio.current.currentTime = +e.target.value
          setCurrentDuration(+e.target.value)
        }}
      ></input>
      <span className="text-bg-500 -mt-0.5">
        {dayjs
          .duration(+currentMusic.duration, 'seconds')
          .format(+currentMusic.duration >= 3600 ? 'H:mm:ss' : 'm:ss')}
      </span>
    </div>
  )
}

export default DurationSlider
