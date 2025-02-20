/* eslint-disable sonarjs/no-small-switch */
import { Menu, MenuButton, MenuItems } from '@headlessui/react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, FAB } from '@components/buttons'
import MenuItem from '@components/buttons/HamburgerMenu/components/MenuItem'
import ModuleHeader from '@components/layouts/module/ModuleHeader'
import ModuleWrapper from '@components/layouts/module/ModuleWrapper'
import APIFallbackComponent from '@components/screens/APIComponentWithFallback'
import useFetch from '@hooks/useFetch'
import { IMomentVaultEntry } from '@interfaces/moment_vault_interfaces'
import AddEntryModal from './components/AddEntryModal'
import AudioEntry from './components/entries/AudioEntry'

function MomentVault(): React.ReactElement {
  const { t } = useTranslation('modules.momentVault')
  const [data, , setData] = useFetch<IMomentVaultEntry[]>(
    '/moment-vault/entries'
  )
  const [addEntryModalOpenType, setAddEntryModalOpenType] = useState<
    'text' | 'audio' | 'photo' | 'video' | null
  >(null)

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
      <APIFallbackComponent data={data}>
        {data => (
          <div className="mt-6 space-y-4">
            {data.map(entry => {
              switch (entry.type) {
                case 'audio':
                  return <AudioEntry key={entry.id} entry={entry} />
                default:
                  return null
              }
            })}
          </div>
        )}
      </APIFallbackComponent>
      <AddEntryModal
        openType={addEntryModalOpenType}
        setData={setData}
        setOpenType={setAddEntryModalOpenType}
        onClose={() => {
          setAddEntryModalOpenType(null)
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
    </ModuleWrapper>
  )
}

export default MomentVault
