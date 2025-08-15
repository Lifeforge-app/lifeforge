import { Menu, MenuButton, MenuItems } from '@headlessui/react'
import { useQuery } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import {
  Button,
  ContextMenuItem,
  FAB,
  ModuleHeader,
  ModuleWrapper
} from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { InferOutput } from 'shared'

import EntryList from './components/EntryList'
import AddEntryModal from './modals/AddEntryModal'

export type MomentVaultEntry = InferOutput<
  typeof forgeAPI.momentVault.entries.list
>['items'][number]

function MomentVault() {
  const open = useModalStore(state => state.open)

  const { t } = useTranslation('apps.momentVault')

  const [page, setPage] = useState(1)

  const dataQuery = useQuery(
    forgeAPI.momentVault.entries.list
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
    <ModuleWrapper>
      <ModuleHeader
        actionButton={
          <Menu as="div" className="relative z-50 hidden md:block">
            <Button
              as={MenuButton}
              className="hidden md:flex"
              icon="tabler:plus"
              tProps={{ item: t('items.entry') }}
              onClick={() => {}}
            >
              new
            </Button>
            <MenuItems
              transition
              anchor="bottom end"
              className="bg-bg-100 dark:bg-bg-800 mt-2 w-[var(--button-width)] overflow-hidden overscroll-contain rounded-md shadow-lg outline-hidden transition duration-100 ease-out focus:outline-hidden data-closed:scale-95 data-closed:opacity-0"
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
                  namespace="apps.momentVault"
                  label={type}
                  onClick={handleAddEntry(type)}
                />
              ))}
            </MenuItems>
          </Menu>
        }
        icon="tabler:history"
        title="Moment Vault"
      />
      <EntryList dataQuery={dataQuery} page={page} setPage={setPage} />
      <Menu>
        <FAB as={MenuButton} hideWhen="md" />
        <MenuItems
          transition
          anchor="bottom end"
          className="bg-bg-100 dark:bg-bg-800 overflow-hidden overscroll-contain rounded-md shadow-lg outline-hidden transition duration-100 ease-out [--anchor-gap:8px] focus:outline-hidden data-closed:scale-95 data-closed:opacity-0"
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
              namespace="apps.momentVault"
              label={type}
              onClick={handleAddEntry(type)}
            />
          ))}
        </MenuItems>
      </Menu>
    </ModuleWrapper>
  )
}

export default MomentVault
