/* eslint-disable @typescript-eslint/no-explicit-any */
import { Icon } from '@iconify/react/dist/iconify.js'
import { useDebounce } from '@uidotdev/usehooks'
import {
  Button,
  EmptyStateScreen,
  SearchInput,
  useModalStore
} from 'lifeforge-ui'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import forgeAPI from '../utils/forgeAPI'
import CreateEntryModal from './components/CreateEntryModal'
import LocaleEditor from './components/LocaleEditor'
import NamespaceSelector from './components/NamespaceSelector'

function MainContent() {
  const { t } = useTranslation('utils.localeAdmin')

  const open = useModalStore(state => state.open)

  const [namespace, setNamespace] = useState<
    null | 'common' | 'core' | 'apps' | 'utils'
  >(null)

  const [subNamespace, setSubNamespace] = useState<string | null>(null)

  const [oldLocales, setOldLocales] = useState<
    Record<string, any> | 'loading' | 'error'
  >({})

  const [locales, setLocales] = useState<
    Record<string, any> | 'loading' | 'error'
  >({})

  const [searchQuery, setSearchQuery] = useState('')

  const debouncedSearchQuery = useDebounce(searchQuery, 500)

  const [changedKeys, setChangedKeys] = useState<string[]>([])

  const [syncLoading, setSyncLoading] = useState(false)

  async function syncWithServer() {
    if (typeof locales === 'string') {
      return
    }

    setSyncLoading(true)

    try {
      if (!namespace || !subNamespace) {
        alert('Please select a namespace and sub-namespace first')

        return
      }

      const data = Object.fromEntries(
        changedKeys.map(key => {
          const final: Record<string, string> = {}

          for (const lng of Object.keys(locales)) {
            final[lng] = key.split('.').reduce((acc, k) => acc[k], locales[lng])
          }

          return [key, final]
        })
      )

      await forgeAPI.locales.manager.sync
        .input({
          namespace,
          subnamespace: subNamespace
        })
        .mutate({ data })

      setChangedKeys([])
    } catch {
      alert('Failed to sync with server')
    }
    setOldLocales(JSON.parse(JSON.stringify(locales)))
    setSyncLoading(false)
  }

  function setValue(lng: string, path: string[], value: string) {
    if (typeof locales === 'string') {
      return
    }

    const newData = { ...locales }

    const target = path
      .slice(0, -1)
      .reduce((acc, key) => acc[key], newData[lng])

    target[path[path.length - 1]] = value

    setLocales(newData)
  }

  async function renameEntry(path: string) {
    if (!namespace || !subNamespace) {
      return
    }

    if (changedKeys.includes(path)) {
      alert('Please sync changes with the server before renaming')

      return
    }

    const newName = prompt('Enter the new name')

    if (!newName) {
      return
    }

    try {
      await forgeAPI.locales.manager.rename
        .input({
          namespace,
          subnamespace: subNamespace
        })
        .mutate({
          path,
          newName
        })
      ;[setLocales, setOldLocales].forEach(e => {
        e(prev => {
          if (typeof prev === 'string') {
            return prev
          }

          const newData = JSON.parse(JSON.stringify(prev))

          for (const lng in newData) {
            let targetObject = newData[lng]

            const pathArray = path.split('.')

            for (let i = 0; i < pathArray.length; i++) {
              if (i === pathArray.length - 1) {
                targetObject[newName] = targetObject[pathArray[i]]
                delete targetObject[pathArray[i]]
              } else {
                targetObject = targetObject[pathArray[i]]
              }
            }
          }

          return newData
        })
      })
    } catch {
      alert('Failed to rename entry')
    }
  }

  async function deleteEntry(path: string) {
    if (typeof locales === 'string' || !namespace || !subNamespace) {
      return
    }

    if (!confirm('Are you sure you want to delete this entry?')) {
      return
    }

    try {
      await forgeAPI.locales.manager.remove
        .input({
          namespace,
          subnamespace: subNamespace
        })
        .mutate({
          path
        })
      ;[setLocales, setOldLocales].forEach(e => {
        e(prev => {
          if (typeof prev === 'string') {
            return prev
          }

          const newData = JSON.parse(JSON.stringify(prev))

          for (const lng in newData) {
            let targetObject = newData[lng]

            const pathArray = path.split('.')

            for (let i = 0; i < pathArray.length; i++) {
              if (i === pathArray.length - 1) {
                delete targetObject[pathArray[i]]
              } else {
                targetObject = targetObject[pathArray[i]]
              }
            }
          }

          return newData
        })
      })
    } catch {
      alert('Failed to delete entry')
    }
  }

  async function fetchSuggestions(path: string) {
    if (typeof locales === 'string' || !namespace || !subNamespace) {
      return
    }

    const hint = prompt('Enter the suggestion')

    try {
      const data = await forgeAPI.locales.manager.getTranslationSuggestions
        .input({
          namespace,
          subnamespace: subNamespace
        })
        .mutate({
          path,
          hint: hint ?? ''
        })

      setLocales(prev => {
        if (typeof prev === 'string') {
          return prev
        }

        const newData = JSON.parse(JSON.stringify(prev))

        for (const lng in data) {
          let targetObject = newData[lng]

          const pathArray = path.split('.')

          for (let i = 0; i < pathArray.length; i++) {
            if (i === pathArray.length - 1) {
              targetObject[pathArray[i]] = data[lng as keyof typeof data]
            } else {
              targetObject = targetObject[pathArray[i]]
            }
          }
        }

        return newData
      })

      setChangedKeys(prev => {
        if (prev.includes(path)) {
          return prev
        }

        return [...prev, path]
      })
    } catch {
      alert('Failed to fetch suggestions')
    }
  }

  const fetchLocales = useCallback(async () => {
    if (typeof locales === 'string' || !namespace || !subNamespace) {
      return
    }

    setLocales('loading')

    try {
      const data = await forgeAPI.locales.manager.listLocales
        .input({
          namespace,
          subnamespace: subNamespace
        })
        .query()

      setLocales(data)
      setOldLocales(JSON.parse(JSON.stringify(data)))
    } catch {
      setLocales('error')
    }
  }, [namespace, subNamespace])

  const handleCreateEntryModalOpen = useCallback(
    (targetEntry: string) => {
      open(CreateEntryModal, {
        target: [namespace ?? '', subNamespace ?? '', targetEntry ?? ''],
        setLocales,
        setOldLocales
      })
    },
    [namespace, subNamespace]
  )

  useEffect(() => {
    if (namespace && subNamespace) {
      fetchLocales()
    }
  }, [namespace, subNamespace, fetchLocales])

  useEffect(() => {
    setChangedKeys([])
    setSearchQuery('')
  }, [namespace, subNamespace])

  return (
    <div className="flex h-full w-full flex-1 flex-col">
      <header className="flex w-full items-center justify-between">
        <h1 className="flex items-center gap-2">
          <Icon
            className="text-custom-400 text-5xl"
            icon="mingcute:translate-line"
          />
          <div>
            <div className="text-2xl font-semibold">
              Lifeforge<span className="text-custom-400">.</span>
            </div>
            <div className="text-bg-500 font-medium">{t('title')}</div>
          </div>
        </h1>
        {namespace && subNamespace && typeof locales !== 'string' && (
          <div className="flex items-center gap-2">
            <Button
              icon="tabler:plus"
              tProps={{
                item: t('items.entry')
              }}
              variant="plain"
              onClick={() => {
                handleCreateEntryModalOpen('')
              }}
            >
              new
            </Button>
            <Button
              disabled={changedKeys.length === 0}
              icon="tabler:refresh"
              loading={syncLoading}
              namespace="utils.localeAdmin"
              onClick={syncWithServer}
            >
              Sync with Server
            </Button>
          </div>
        )}
      </header>
      <NamespaceSelector
        namespace={namespace}
        setNamespace={setNamespace}
        setSubNamespace={setSubNamespace}
        showWarning={changedKeys.length > 0}
        subNamespace={subNamespace}
      />

      {namespace && subNamespace ? (
        <div className="mt-3 flex h-full flex-1 flex-col">
          <SearchInput
            namespace="utils.localeAdmin"
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            stuffToSearch="entry"
          />
          <LocaleEditor
            changedKeys={changedKeys}
            fetchSuggestions={fetchSuggestions}
            locales={locales}
            oldLocales={oldLocales}
            searchQuery={debouncedSearchQuery}
            setChangedKeys={setChangedKeys}
            setValue={setValue}
            onCreateEntry={parent => {
              handleCreateEntryModalOpen(parent)
            }}
            onDeleteEntry={deleteEntry}
            onRenameEntry={renameEntry}
          />
        </div>
      ) : (
        <div className="flex-center flex-1">
          <EmptyStateScreen
            icon={namespace ? 'tabler:cube-off' : 'tabler:apps-off'}
            name={namespace ? 'subNamespace' : 'namespace'}
            namespace="utils.localeAdmin"
          />
        </div>
      )}
    </div>
  )
}

export default MainContent
