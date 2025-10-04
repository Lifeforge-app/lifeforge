import type { MusicEntry } from '@/providers/MusicProvider'
import dayjs from 'dayjs'
import { ItemWrapper } from 'lifeforge-ui'

import PlayStateIndicator from './components/PlayStateIndicator'
import SideButtons from './components/SideButtons'

function formatDuration(duration: string): string {
  return dayjs
    .duration(+duration, 'second')
    .format(+duration > 3600 ? 'H:mm:ss' : 'm:ss')
}

function MusicListItem({ music }: { music: MusicEntry }) {
  return (
    <ItemWrapper className="flex items-center p-2!">
      <div className="flex w-full min-w-0 items-center gap-2 sm:w-7/12 sm:shrink-0 lg:w-5/12">
        <PlayStateIndicator music={music} />
        <div className="w-full min-w-0">
          <p className="w-full min-w-0 truncate pr-8">{music.name}</p>
          <p className="text-bg-500 block w-full min-w-0 truncate text-sm md:hidden">
            {music.author} <span className="text-bg-500">•</span>{' '}
            {formatDuration(music.duration)}
          </p>
        </div>
      </div>
      <div className="text-bg-500 hidden w-3/12 min-w-0 lg:block">
        <p className="w-full min-w-0 truncate pr-8">{music.author}</p>
      </div>
      <div className="text-bg-500 hidden w-3/12 min-w-0 sm:block lg:w-2/12">
        {formatDuration(music.duration)}
      </div>
      <SideButtons music={music} />
    </ItemWrapper>
  )
}

export default MusicListItem
