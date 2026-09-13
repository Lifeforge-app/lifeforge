import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

dayjs.extend(duration)

export default function formatTime(seconds: number) {
  if (seconds >= 3600) {
    return dayjs.duration(seconds, 'seconds').format('H[h ]mm[m]ss[s]')
  }

  return dayjs.duration(seconds, 'seconds').format('mm[m]ss[s]')
}
