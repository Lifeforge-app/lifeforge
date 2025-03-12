/* eslint-disable import/named */
import { Menu, MenuButton, MenuItems } from '@headlessui/react'
import { ListResult } from 'pocketbase'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button, DeleteConfirmationModal, FAB, MenuItem } from '@lifeforge/ui'
import { ModuleWrapper } from '@lifeforge/ui'
import { ModuleHeader } from '@lifeforge/ui'

import { IMomentVaultEntry } from '@modules/MomentVault/interfaces/moment_vault_interfaces'

import useFetch from '@hooks/useFetch'

import AddEntryModal from './components/AddEntryModal'
import EntryList from './components/EntryList'

function MomentVault(): React.ReactElement {
  const { t } = useTranslation('modules.momentVault')
  const [page, setPage] = useState(1)
  const [data, refreshData, setData] = useFetch<ListResult<IMomentVaultEntry>>(
    `/moment-vault/entries?page=${page}`
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
                namespace="modules.momentVault"
                text="text"
                onClick={() => {
                  setAddEntryModalOpenType('text')
                }}
              />
              <MenuItem
                icon="tabler:microphone"
                namespace="modules.momentVault"
                text="audio"
                onClick={() => {
                  setAddEntryModalOpenType('audio')
                }}
              />
              <MenuItem
                icon="tabler:camera"
                namespace="modules.momentVault"
                text="photo"
                onClick={() => {
                  setAddEntryModalOpenType('photo')
                }}
              />
              <MenuItem
                icon="tabler:video"
                namespace="modules.momentVault"
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
        data={data}
        page={page}
        setData={setData}
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
            namespace="modules.momentVault"
            text="text"
            onClick={() => {
              setAddEntryModalOpenType('text')
            }}
          />
          <MenuItem
            icon="tabler:microphone"
            namespace="modules.momentVault"
            text="audio"
            onClick={() => {
              setAddEntryModalOpenType('audio')
            }}
          />
          <MenuItem
            icon="tabler:camera"
            namespace="modules.momentVault"
            text="photo"
            onClick={() => {
              setAddEntryModalOpenType('photo')
            }}
          />
          <MenuItem
            icon="tabler:video"
            namespace="modules.momentVault"
            text="video"
            onClick={() => {
              setAddEntryModalOpenType('video')
            }}
          />
        </MenuItems>
      </Menu>
      <AddEntryModal
        openType={addEntryModalOpenType}
        refreshData={refreshData}
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
        updateDataList={refreshData}
        onClose={() => setDeleteEntryConfirmationModalOpen(false)}
      />
    </ModuleWrapper>
  )
}

export default MomentVault
