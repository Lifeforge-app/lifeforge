import { useDebounce } from '@uidotdev/usehooks'
import React, { useState } from 'react'
import Input from '@components/ButtonsAndInputs/Input'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import useFetch from '@hooks/useFetch'
import { type IYoutubePlaylistEntry } from '@interfaces/youtube_video_storage_interfaces'
import PlaylistInfo from '../PlaylistInfo'

const URL_REGEX =
  /(https?:\/\/)?(www.)?(youtube\.com|youtu\.be|youtube-nocookie\.com)\/(?:embed\/|v\/|watch\?v=|watch\?list=(.*)&v=)?((\w|-){11})(&list=(?<list>\w+)&?)?/

function PlaylistSection({
  onClose,
  refreshVideos
}: {
  onClose: () => void
  refreshVideos: () => void
}): React.ReactElement {
  const [playlistUrl, setPlaylistUrl] = useState<string>('')
  const debouncedPlaylistUrl = useDebounce(playlistUrl, 500)
  const [playlistInfo] = useFetch<IYoutubePlaylistEntry>(
    `/youtube-video-storage/playlist/get-info/${debouncedPlaylistUrl.match(URL_REGEX)?.groups?.list
    }`,
    URL_REGEX.test(debouncedPlaylistUrl)
  )

  function updatePlaylistUrl(e: React.ChangeEvent<HTMLInputElement>): void {
    setPlaylistUrl(e.target.value)
  }

  return (
    <>
      <Input
        icon="tabler:link"
        name="Playlist URL"
        value={playlistUrl}
        updateValue={updatePlaylistUrl}
        placeholder="https://www.youtube.com/playlist?list=PL..."
        darker
        additionalClassName="mt-4"
      />
      <div className="mt-6">
        {URL_REGEX.test(playlistUrl) && (
          <APIComponentWithFallback data={playlistInfo}>
            {playlistInfo => <PlaylistInfo playlistInfo={playlistInfo} />}
          </APIComponentWithFallback>
        )}
      </div>
    </>
  )
}

export default PlaylistSection
