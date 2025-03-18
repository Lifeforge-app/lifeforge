/* eslint-disable import/named */
import { Menu, MenuButton, MenuItems } from '@headlessui/react'
import { ListResult } from 'pocketbase'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  Button,
  DeleteConfirmationModal,
  FAB,
  MenuItem,
  ModuleHeader,
  ModuleWrapper
} from '@lifeforge/ui'

import { IMomentVaultEntry } from '@apps/MomentVault/interfaces/moment_vault_interfaces'

import useAPIQuery from '@hooks/useAPIQuery'

import AddEntryModal from './components/AddEntryModal'
import EntryList from './components/EntryList'

function MomentVault() {
  const { t } = useTranslation('apps.momentVault')
  const [page, setPage] = useState(1)
  const dataQuery = useAPIQuery<ListResult<IMomentVaultEntry>>(
    `/moment-vault/entries?page=${page}`,
    ['moment-vault', 'entries', page]
  )
  const [addEntryModalOpenType, setAddEntryModalOpenType] = useState<
    'text' | 'audio' | 'photo' | 'video' | null
  >(null)
  const [existedData, setExistedData] = useState<IMomentVaultEntry | null>(null)
  const [
    deleteEntryConfirmationModalOpen,
    setDeleteEntryConfirmationModalOpen
  ] = useState(false)

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
              className="bg-bg-100 dark:bg-bg-800 outline-hidden focus:outline-hidden data-closed:scale-95 data-closed:opacity-0 mt-2 w-[var(--button-width)] overflow-hidden overscroll-contain rounded-md shadow-lg transition duration-100 ease-out"
            >
              <MenuItem
                icon="tabler:file-text"
                namespace="apps.momentVault"
                text="text"
                onClick={() => {
                  setAddEntryModalOpenType('text')
                }}
              />
              <MenuItem
                icon="tabler:microphone"
                namespace="apps.momentVault"
                text="audio"
                onClick={() => {
                  setAddEntryModalOpenType('audio')
                }}
              />
              <MenuItem
                icon="tabler:camera"
                namespace="apps.momentVault"
                text="photo"
                onClick={() => {
                  setAddEntryModalOpenType('photo')
                }}
              />
              <MenuItem
                icon="tabler:video"
                namespace="apps.momentVault"
                text="video"
                onClick={() => {
                  setAddEntryModalOpenType('video')
                }}
              />
            </MenuItems>
          </Menu>
        }
        icon="tabler:history"
        title="Moment Vault"
      />
      <EntryList
        addEntryModalOpenType={addEntryModalOpenType}
        dataQuery={dataQuery}
        page={page}
        setPage={setPage}
        onDelete={(data: IMomentVaultEntry) => {
          setExistedData(data)
          setDeleteEntryConfirmationModalOpen(true)
        }}
      />
      <Menu>
        <FAB as={MenuButton} hideWhen="md" />
        <MenuItems
          transition
          anchor="bottom end"
          className="bg-bg-100 dark:bg-bg-800 outline-hidden focus:outline-hidden data-closed:scale-95 data-closed:opacity-0 w-48 overflow-hidden overscroll-contain rounded-md shadow-lg transition duration-100 ease-out [--anchor-gap:8px]"
        >
          <MenuItem
            icon="tabler:file-text"
            namespace="apps.momentVault"
            text="text"
            onClick={() => {
              setAddEntryModalOpenType('text')
            }}
          />
          <MenuItem
            icon="tabler:microphone"
            namespace="apps.momentVault"
            text="audio"
            onClick={() => {
              setAddEntryModalOpenType('audio')
            }}
          />
          <MenuItem
            icon="tabler:camera"
            namespace="apps.momentVault"
            text="photo"
            onClick={() => {
              setAddEntryModalOpenType('photo')
            }}
          />
          <MenuItem
            icon="tabler:video"
            namespace="apps.momentVault"
            text="video"
            onClick={() => {
              setAddEntryModalOpenType('video')
            }}
          />
        </MenuItems>
      </Menu>
      <AddEntryModal
        entriesQueryKey={['moment-vault', 'entries', page]}
        openType={addEntryModalOpenType}
        setOpenType={setAddEntryModalOpenType}
        onClose={() => {
          setAddEntryModalOpenType(null)
        }}
      />
      <DeleteConfirmationModal
        apiEndpoint="/moment-vault/entries"
        data={existedData}
        isOpen={deleteEntryConfirmationModalOpen}
        itemName="entry"
        queryKey={['moment-vault', 'entries', page]}
        queryUpdateType="invalidate"
        onClose={() => setDeleteEntryConfirmationModalOpen(false)}
      />
    </ModuleWrapper>
  )
}

export default MomentVault
