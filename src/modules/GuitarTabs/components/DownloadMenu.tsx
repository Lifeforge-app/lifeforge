import React from 'react'
import HamburgerMenu from '@components/buttons/HamburgerMenu'
import MenuItem from '@components/buttons/HamburgerMenu/components/MenuItem'
import { type IGuitarTabsEntry } from '@interfaces/guitar_tabs_interfaces'
import forceDown from '@utils/forceDown'

function DownloadMenu({
  entry
}: {
  entry: IGuitarTabsEntry
}): React.ReactElement {
  return (
    <HamburgerMenu className="relative shrink-0" customIcon="tabler:download">
      <MenuItem
        onClick={() => {
          forceDown(
            `${import.meta.env.VITE_API_HOST}/media/${entry.collectionId}/${
              entry.id
            }/${entry.pdf}`,
            entry.pdf
          ).catch(console.error)
        }}
        text="PDF"
        icon="tabler:file-text"
      />
      {entry.audio !== '' && (
        <MenuItem
          onClick={() => {
            forceDown(
              `${import.meta.env.VITE_API_HOST}/media/${entry.collectionId}/${
                entry.id
              }/${entry.audio}`,
              entry.audio
            ).catch(console.error)
          }}
          text="Audio"
          icon="tabler:music"
        />
      )}
      {entry.musescore !== '' && (
        <MenuItem
          onClick={() => {
            forceDown(
              `${import.meta.env.VITE_API_HOST}/media/${entry.collectionId}/${
                entry.id
              }/${entry.musescore}`,
              entry.musescore
            ).catch(console.error)
          }}
          text="Musescore"
          icon="simple-icons:musescore"
        />
      )}
    </HamburgerMenu>
  )
}

export default DownloadMenu
