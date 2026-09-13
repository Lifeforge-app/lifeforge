import { WithQuery } from '@lifeforge/ui'

import { useMusicContext } from '@/providers/MusicProvider'

import MusicListItem from './components/MusicListItem'

function MusicList({ searchQuery }: { searchQuery: string }) {
  const { musicsQuery } = useMusicContext()

  return (
    <WithQuery query={musicsQuery}>
      {musics => (
        <ul className="space-y-3 pb-12">
          {musics
            .filter(music =>
              music.name.toLowerCase().includes(searchQuery.toLowerCase())
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
