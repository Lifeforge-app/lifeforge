import { Icon } from '@iconify/react/dist/iconify.js'
import {
  Button,
  ListboxOrComboboxInput,
  ListboxOrComboboxOption,
  ModalHeader,
  TextInput
} from 'lifeforge-ui'
import React, { useState } from 'react'

import { fetchAPI } from 'shared/lib'

const TYPES = [
  ['tabler:folder', 'Folder'],
  ['tabler:file-text', 'Entry']
]

function CreateEntryModal({
  onClose,
  data: { target, setLocales, setOldLocales }
}: {
  onClose: () => void
  data: {
    target: [string, string, string]
    setLocales: React.Dispatch<
      React.SetStateAction<Record<string, any> | 'loading' | 'error'>
    >
    setOldLocales: React.Dispatch<
      React.SetStateAction<Record<string, any> | 'loading' | 'error'>
    >
  }
}) {
  const [selectedType, setSelectedType] = useState<'folder' | 'entry'>('entry')

  const [name, setName] = useState('')

  const [loading, setLoading] = useState(false)

  async function onSubmit() {
    if (!name.trim()) {
      alert('Name is required')

      return
    }

    setLoading(true)

    try {
      await fetchAPI(
        import.meta.env.VITE_API_HOST,
        `/locales/manager/${selectedType}/${target[0]}/${target[1]}`,
        {
          method: 'POST',
          body: {
            path: [target[2], name].filter(Boolean).join('.')
          }
        }
      )

      onClose()
      ;[setLocales, setOldLocales].forEach(e =>
        e(prev => {
          if (typeof prev === 'string') {
            return prev
          }

          const newData = JSON.parse(JSON.stringify(prev))

          for (const lng in newData) {
            let targetObject = newData[lng]

            const path = target[2].split('.').filter(Boolean)

            for (let i = 0; i < path.length; i++) {
              if (!targetObject[path[i]]) {
                targetObject[path[i]] = {}
              }

              targetObject = targetObject[path[i]]
            }

            targetObject[name] = selectedType === 'folder' ? {} : ''
          }

          return newData
        })
      )
    } catch {
      alert('Failed to create entry')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-w-[40vw]">
      <ModalHeader
        icon="tabler:plus"
        namespace="utils.localeAdmin"
        title="entry.create"
        onClose={onClose}
      />
      <div className="space-y-4">
        <TextInput
          darker
          disabled
          className="w-full"
          icon="tabler:category-2"
          name="namespace"
          namespace="utils.localeAdmin"
          placeholder=""
          setValue={() => {}}
          value={target[0]}
        />
        <TextInput
          darker
          disabled
          className="w-full"
          icon="tabler:cube"
          name="sub namespace"
          namespace="utils.localeAdmin"
          placeholder=""
          setValue={() => {}}
          value={target[1]}
        />
        <TextInput
          darker
          disabled
          className="w-full"
          icon="tabler:folder"
          name="parent"
          namespace="utils.localeAdmin"
          placeholder=""
          setValue={() => {}}
          value={target[2] || 'root'}
        />
        <ListboxOrComboboxInput
          buttonContent={
            <div className="flex items-center gap-2">
              <Icon
                className="size-4"
                icon={
                  TYPES.find(type => type[1].toLowerCase() === selectedType)![0]
                }
              />
              {selectedType[0].toUpperCase() + selectedType.slice(1)}
            </div>
          }
          className="w-full"
          icon="tabler:category-2"
          name="type"
          namespace="utils.localeAdmin"
          setValue={value => {
            setSelectedType(value.toLowerCase() as 'folder' | 'entry')
          }}
          type="listbox"
          value={target[0]}
        >
          {TYPES.map(type => (
            <ListboxOrComboboxOption
              key={type[1]}
              icon={type[0]}
              text={type[1]}
              value={type[1]}
            />
          ))}
        </ListboxOrComboboxInput>
        <TextInput
          darker
          className="w-full"
          icon="tabler:file-text"
          name="name"
          namespace="utils.localeAdmin"
          placeholder="nameOfTheEntry"
          setValue={setName}
          value={name}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault()
              onSubmit()
            }
          }}
        />
      </div>
      <Button
        className="mt-6 w-full"
        icon="tabler:plus"
        loading={loading}
        onClick={onSubmit}
      >
        Create
      </Button>
    </div>
  )
}

export default CreateEntryModal
