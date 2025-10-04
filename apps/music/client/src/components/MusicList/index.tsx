import { useMusicContext } from '@/providers/MusicProvider'
import { WithQuery } from 'lifeforge-ui'

import MusicListItem from './components/MusicListItem'

function MusicList({ debouncedSearchQuery }: { debouncedSearchQuery: string }) {
  const { musicsQuery } = useMusicContext()

  return (
    <WithQuery query={musicsQuery}>
      {musics => (
        <ul className="space-y-3 pb-12">
          {musics
            .filter(music =>
              music.name
                .toLowerCase()
                .includes(debouncedSearchQuery.toLowerCase())
            )
            .map(music => (
              <MusicListItem key={music.id} music={music} />
            ))}
        </ul>
      )}
    </WithQuery>
  )
}

export default MusicList
