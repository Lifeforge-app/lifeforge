import { forceDown } from '@lifeforge/core'
import { HamburgerMenu, MenuItem } from '@lifeforge/ui'

import { type IGuitarTabsEntry } from '../interfaces/guitar_tabs_interfaces'

function DownloadMenu({ entry }: { entry: IGuitarTabsEntry }) {
  return (
    <HamburgerMenu customIcon="tabler:download">
      <MenuItem
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
        <MenuItem
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
        <MenuItem
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
    </HamburgerMenu>
  )
}

export default DownloadMenu
