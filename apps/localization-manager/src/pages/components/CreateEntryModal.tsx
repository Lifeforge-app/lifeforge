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
}): React.ReactElement {
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
            const path = target[2].split('.')
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
        title="entry.create"
        namespace="utils.localeAdmin"
        icon="tabler:plus"
        onClose={onClose}
      />
      <div className="space-y-4">
        <TextInput
          name="namespace"
          namespace="utils.localeAdmin"
          icon="tabler:category-2"
          className="w-full"
          value={target[0]}
          setValue={() => {}}
          disabled
          darker
          placeholder=""
        />
        <TextInput
          name="sub namespace"
          namespace="utils.localeAdmin"
          icon="tabler:cube"
          className="w-full"
          value={target[1]}
          setValue={() => {}}
          disabled
          darker
          placeholder=""
        />
        <TextInput
          name="parent"
          namespace="utils.localeAdmin"
          icon="tabler:folder"
          className="w-full"
          value={target[2] || 'root'}
          setValue={() => {}}
          disabled
          darker
          placeholder=""
        />
        <ListboxOrComboboxInput
          type="listbox"
          name="type"
          namespace="utils.localeAdmin"
          icon="tabler:category-2"
          className="w-full"
          value={target[0]}
          setValue={value => {
            setSelectedType(value.toLowerCase() as 'folder' | 'entry')
          }}
          buttonContent={
            <div className="flex items-center gap-2">
              <Icon
                icon={
                  TYPES.find(type => type[1].toLowerCase() === selectedType)![0]
                }
                className="size-4"
              />
              {selectedType[0].toUpperCase() + selectedType.slice(1)}
            </div>
          }
        >
          {TYPES.map(type => (
            <ListboxOrComboboxOption
              key={type[1]}
              value={type[1]}
              text={type[1]}
              icon={type[0]}
            />
          ))}
        </ListboxOrComboboxInput>
        <TextInput
          name="name"
          namespace="utils.localeAdmin"
          icon="tabler:file-text"
          className="w-full"
          value={name}
          setValue={setName}
          darker
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault()
              onSubmit()
            }
          }}
          placeholder="nameOfTheEntry"
        />
      </div>
      <Button
        icon="tabler:plus"
        className="mt-6 w-full"
        loading={loading}
        onClick={onSubmit}
      >
        Create
      </Button>
    </div>
  )
}

export default CreateEntryModal
