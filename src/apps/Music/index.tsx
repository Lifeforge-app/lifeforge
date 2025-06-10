import { useDebounce } from '@uidotdev/usehooks'
import { useEffect } from 'react'

import {
  EmptyStateScreen,
  ModuleHeader,
  ModuleWrapper,
  QueryWrapper,
  Scrollbar,
  SearchInput
} from '@lifeforge/ui'
import { useModalsEffect } from '@lifeforge/ui'

import { useMusicContext } from '@apps/Music/providers/MusicProvider'

import AddMusicButton from './components/AddMusicButton'
import BottomBar from './components/Bottombar'
import MusicList from './components/MusicList'
import { MusicModals } from './modals'

function Music() {
  const { searchQuery, setSearchQuery, musicsQuery, currentMusic, togglePlay } =
    useMusicContext()
  const debouncedSearchQuery = useDebounce(searchQuery.trim(), 300)

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' && (e.target as HTMLElement).tagName !== 'INPUT') {
        e.preventDefault()
        if (currentMusic !== null) {
          togglePlay(currentMusic).catch(console.error)
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)

    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  })

  useModalsEffect(MusicModals)

  return (
    <ModuleWrapper>
      <ModuleHeader
        actionButton={<AddMusicButton />}
        icon="tabler:music"
        title="Music"
        totalItems={musicsQuery.data?.length}
      />
      <div className="music relative mt-4 flex size-full min-h-0 min-w-0 flex-col sm:mt-0">
        <SearchInput
          namespace="apps.music"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          stuffToSearch="music"
        />
        <div className="divide-bg-200/50 dark:divide-bg-900 relative flex size-full min-w-0 flex-col divide-y-2">
          <Scrollbar>
            <QueryWrapper query={musicsQuery}>
              {musics =>
                musics.filter(music =>
                  music.name
                    .toLowerCase()
                    .includes(debouncedSearchQuery.toLowerCase())
                ).length > 0 ? (
                  <MusicList debouncedSearchQuery={debouncedSearchQuery} />
                ) : (
                  <EmptyStateScreen
                    customCTAButton={
                      musics.length > 0 ? <AddMusicButton /> : undefined
                    }
                    icon={
                      musics.length > 0
                        ? 'tabler:search-off'
                        : 'tabler:music-off'
                    }
                    name={musics.length > 0 ? 'result' : 'music'}
                    namespace="apps.music"
                  />
                )
              }
            </QueryWrapper>
          </Scrollbar>
        </div>
        {currentMusic !== null && <BottomBar />}
      </div>
    </ModuleWrapper>
  )
}

export default Music
