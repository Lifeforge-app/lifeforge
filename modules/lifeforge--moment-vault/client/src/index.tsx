import { useQuery } from '@tanstack/react-query'
import { useCallback, useState } from 'react'
import 'react-photo-album/styles.css'

import type { InferOutput } from '@lifeforge/api'
import { useModuleTranslation } from '@lifeforge/localization'
import {
  Button,
  ContextMenu,
  ContextMenuItem,
  FAB,
  ModuleHeader,
  useModalStore
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'
import { AudioPlayerProvider } from '@/providers/AudioPlayerProvider'

import EntryList from './components/EntryList'
import AddEntryModal from './modals/AddEntryModal'

export type MomentVaultEntry = InferOutput<
  typeof forgeAPI.entries.list
>['items'][number]

function MomentVault() {
  const { open } = useModalStore()
  const { t } = useModuleTranslation()
  const [page, setPage] = useState(1)

  const dataQuery = useQuery(
    forgeAPI.entries.list
      .input({
        page: page.toString()
      })
      .queryOptions()
  )

  const handleAddEntry = useCallback(
    (type: string) => () => {
      open(AddEntryModal, {
        type: type as 'text' | 'audio' | 'photos' | 'video'
      })
    },
    [page]
  )

  return (
    <AudioPlayerProvider>
      <ModuleHeader
        trailing={
          <ContextMenu
            buttonComponent={
              <Button
                className="hidden md:flex"
                icon="tabler:plus"
                tProps={{ item: t('items.entry') }}
                onClick={() => {}}
              >
                new
              </Button>
            }
          >
            {[
              { icon: 'tabler:file-text', type: 'text' },
              { icon: 'tabler:microphone', type: 'audio' },
              { icon: 'tabler:camera', type: 'photos' },
              { icon: 'tabler:video', type: 'video' }
            ].map(({ icon, type }) => (
              <ContextMenuItem
                key={type}
                icon={icon}
                label={type}
                onClick={handleAddEntry(type)}
              />
            ))}
          </ContextMenu>
        }
      />
      <EntryList dataQuery={dataQuery} page={page} setPage={setPage} />
      <ContextMenu
        buttonComponent={<FAB className="static!" visibilityBreakpoint="md" />}
        className="fixed bottom-6 right-6"
      >
        {[
          { icon: 'tabler:file-text', type: 'text' },
          { icon: 'tabler:microphone', type: 'audio' },
          { icon: 'tabler:camera', type: 'photos' },
          { icon: 'tabler:video', type: 'video' }
        ].map(({ icon, type }) => (
          <ContextMenuItem
            key={type}
            icon={icon}
            label={type}
            onClick={handleAddEntry(type)}
          />
        ))}
      </ContextMenu>
    </AudioPlayerProvider>
  )
}

export default MomentVault
