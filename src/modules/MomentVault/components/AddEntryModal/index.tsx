/* eslint-disable sonarjs/no-small-switch */
import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'
import {
  ListboxOrComboboxInput,
  ListboxOrComboboxOption
} from '@components/inputs'
import ModalHeader from '@components/modals/ModalHeader'
import ModalWrapper from '@components/modals/ModalWrapper'
import { Loadable } from '@interfaces/common'
import { IMomentVaultEntry } from '@interfaces/moment_vault_interfaces'
import AudioType from './components/AudioType'

const TYPES = [
  {
    id: 'text',
    name: 'Text',
    icon: 'tabler:file-text'
  },
  {
    id: 'audio',
    name: 'Audio',
    icon: 'tabler:microphone'
  },
  {
    id: 'photo',
    name: 'Photo',
    icon: 'tabler:photo'
  },
  {
    id: 'video',
    name: 'Video',
    icon: 'tabler:video'
  }
]

function AddEntryModal({
  openType,
  setOpenType,
  onClose,
  setData
}: {
  openType: 'text' | 'audio' | 'photo' | 'video' | null
  setOpenType: (type: 'text' | 'audio' | 'photo' | 'video' | null) => void
  onClose: () => void
  setData: React.Dispatch<React.SetStateAction<Loadable<IMomentVaultEntry[]>>>
}): React.ReactElement {
  return (
    <ModalWrapper isOpen={openType !== null} minWidth="50vw">
      <ModalHeader
        icon="tabler:plus"
        namespace="modules.momentVault"
        title="Add Entry"
        onClose={onClose}
      />
      <div className="space-y-4">
        <ListboxOrComboboxInput
          required
          buttonContent={
            <>
              <Icon
                className="size-5"
                icon={TYPES.find(l => l.id === openType)?.icon ?? ''}
              />
              <span className="-mt-px block truncate">
                {TYPES.find(l => l.id === openType)?.name ?? 'None'}
              </span>
            </>
          }
          icon="tabler:apps"
          name="Entry Type"
          namespace="modules.momentVault"
          setValue={setOpenType}
          type="listbox"
          value={openType}
        >
          {TYPES.map(({ name, id, icon }, i) => (
            <ListboxOrComboboxOption
              key={i}
              icon={icon}
              text={name}
              value={id}
            />
          ))}
        </ListboxOrComboboxInput>
        {(() => {
          switch (openType) {
            case 'audio':
              return (
                <AudioType
                  onSuccess={data => {
                    onClose()
                    setData(prev => {
                      if (typeof prev === 'string') return prev
                      return [...prev, data]
                    })
                  }}
                />
              )
            default:
              return <></>
          }
        })()}
      </div>
    </ModalWrapper>
  )
}

export default AddEntryModal
