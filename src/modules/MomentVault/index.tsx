/* eslint-disable import/named */
import { Menu, MenuButton, MenuItems } from '@headlessui/react'
import { ListResult } from 'pocketbase'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, FAB } from '@components/buttons'
import MenuItem from '@components/buttons/HamburgerMenu/components/MenuItem'
import ModuleHeader from '@components/layouts/module/ModuleHeader'
import ModuleWrapper from '@components/layouts/module/ModuleWrapper'
import DeleteConfirmationModal from '@components/modals/DeleteConfirmationModal'
import useFetch from '@hooks/useFetch'
import { IMomentVaultEntry } from '@interfaces/moment_vault_interfaces'
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
              className="mt-2 overflow-hidden w-[var(--button-width)] overscroll-contain rounded-md bg-bg-100 shadow-lg outline-hidden transition duration-100 ease-out focus:outline-hidden data-closed:scale-95 data-closed:opacity-0 dark:bg-bg-800"
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
          className="w-48 overflow-hidden overscroll-contain rounded-md bg-bg-100 shadow-lg outline-hidden transition duration-100 ease-out [--anchor-gap:8px] focus:outline-hidden data-closed:scale-95 data-closed:opacity-0 dark:bg-bg-800"
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
