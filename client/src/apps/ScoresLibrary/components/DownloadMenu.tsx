import forceDown from '@utils/forceDown'
import { ContextMenu, ContextMenuItem } from 'lifeforge-ui'

import type { ScoreLibraryEntry } from '..'

function DownloadMenu({ entry }: { entry: ScoreLibraryEntry }) {
  return (
    <ContextMenu customIcon="tabler:download">
      <ContextMenuItem
        icon="tabler:file-text"
        text="PDF"
        onClick={() => {
          forceDown(
            `${import.meta.env.VITE_API_HOST}/media/${entry.collectionId}/${
              entry.id
            }/${entry.pdf}`,
            entry.pdf
          ).catch(console.error)
        }}
      />
      {entry.audio !== '' && (
        <ContextMenuItem
          icon="tabler:music"
          text="Audio"
          onClick={() => {
            forceDown(
              `${import.meta.env.VITE_API_HOST}/media/${entry.collectionId}/${
                entry.id
              }/${entry.audio}`,
              entry.audio
            ).catch(console.error)
          }}
        />
      )}
      {entry.musescore !== '' && (
        <ContextMenuItem
          icon="simple-icons:musescore"
          text="Musescore"
          onClick={() => {
            forceDown(
              `${import.meta.env.VITE_API_HOST}/media/${entry.collectionId}/${
                entry.id
              }/${entry.musescore}`,
              entry.musescore
            ).catch(console.error)
          }}
        />
      )}
    </ContextMenu>
  )
}

export default DownloadMenu
