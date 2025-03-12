import { useDebounce } from '@uidotdev/usehooks'
import React, { useEffect } from 'react'

import {
  APIFallbackComponent,
  DeleteConfirmationModal,
  EmptyStateScreen,
  Scrollbar,
  SearchInput
, ModuleWrapper , ModuleHeader } from '@lifeforge/ui'

import { useMusicContext } from '@modules/Music/providers/MusicProvider'

import AddMusicButton from './components/AddMusicButton'
import BottomBar from './components/Bottombar'
import MusicList from './components/MusicList'
import ModifyMusicModal from './modals/UpdateMusicModal'
import YoutubeDownloaderModal from './modals/YoutubeDownloaderModal'

function Music(): React.ReactElement {
  const {
    searchQuery,
    setSearchQuery,
    musics,
    refreshMusics,
    currentMusic,
    existedData,
    togglePlay,
    isDeleteMusicConfirmationModalOpen,
    setIsDeleteMusicConfirmationModalOpen
  } = useMusicContext()
  const debouncedSearchQuery = useDebounce(searchQuery.trim(), 500)

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent): void => {
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

  return (
    <ModuleWrapper>
      <ModuleHeader
        actionButton={<AddMusicButton />}
        icon="tabler:music"
        title="Music"
        totalItems={musics.length}
      />
      <div className="music relative mt-4 flex size-full min-h-0 min-w-0 flex-col sm:mt-0">
        <SearchInput
          namespace="modules.music"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          stuffToSearch="music"
        />
        <div className="divide-bg-200/50 dark:divide-bg-900 relative flex size-full min-w-0 flex-col divide-y-2">
          <Scrollbar>
            <APIFallbackComponent data={musics}>
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
                    namespace="modules.music"
                  />
                )
              }
            </APIFallbackComponent>
          </Scrollbar>
        </div>
        {currentMusic !== null && <BottomBar />}
      </div>
      <YoutubeDownloaderModal />
      <DeleteConfirmationModal
        apiEndpoint="music/entries"
        data={existedData}
        isOpen={isDeleteMusicConfirmationModalOpen}
        itemName="music"
        nameKey="name"
        updateDataList={refreshMusics}
        onClose={() => {
          setIsDeleteMusicConfirmationModalOpen(false)
        }}
      />
      <ModifyMusicModal />
    </ModuleWrapper>
  )
}

export default Music
