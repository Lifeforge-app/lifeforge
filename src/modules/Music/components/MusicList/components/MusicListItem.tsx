import moment from 'moment'
import React from 'react'
import { type IMusicEntry } from '@interfaces/music_interfaces'
import PlayStateIndicator from './components/PlayStateIndicator'
import SideButtons from './components/SideButtons'

function formatDuration(duration: string): string {
  return moment
    .utc(moment.duration(duration, 'seconds').asMilliseconds())
    .format(+duration >= 3600 ? 'HH:mm:ss' : 'mm:ss')
}

function MusicListItem({ music }: { music: IMusicEntry }): React.ReactElement {
  return (
    <div className="flex w-full min-w-0 items-center py-2">
      <div className="flex w-full min-w-0 items-center gap-2 sm:w-7/12 sm:shrink-0 lg:w-5/12">
        <PlayStateIndicator music={music} />
        <div className="w-full min-w-0">
          <p className="w-full min-w-0 truncate pr-8">{music.name}</p>
          <p className="block w-full min-w-0 truncate text-sm text-bg-500 md:hidden">
            {music.author} <span className="text-bg-500">•</span>{' '}
            {formatDuration(music.duration)}
          </p>
        </div>
      </div>
      <div className="hidden w-3/12 min-w-0 text-bg-500 lg:block">
        <p className="w-full min-w-0 truncate pr-8">{music.author}</p>
      </div>
      <div className="hidden w-3/12 min-w-0 text-bg-500 sm:block lg:w-2/12">
        {formatDuration(music.duration)}
      </div>
      <SideButtons music={music} />
    </div>
  )
}

export default MusicListItem
