import { Icon } from '@iconify/react/dist/iconify.js'
import { useQuery } from '@tanstack/react-query'
import { useDebounce } from '@uidotdev/usehooks'
import {
  Button,
  EmptyStateScreen,
  QueryWrapper,
  SearchInput,
  useModalStore
} from 'lifeforge-ui'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useLocaleManager } from '../providers/LocaleManagerProvider'
import forgeAPI from '../utils/forgeAPI'
import CreateEntryModal from './components/CreateEntryModal'
import LocaleEditor from './components/LocaleEditor'
import NamespaceSelector from './components/NamespaceSelector'

function MainContent() {
  const { t } = useTranslation('utils.localeAdmin')

  const open = useModalStore(state => state.open)

  const { namespace, subNamespace } = useLocaleManager()

  const localesQuery = useQuery(
    forgeAPI.locales.manager.listLocales
      .input({
        namespace: namespace!,
        subnamespace: subNamespace!
      })
      .queryOptions({
        enabled: !!namespace && !!subNamespace
      })
  )

  const [searchQuery, setSearchQuery] = useState('')

  const debouncedSearchQuery = useDebounce(searchQuery, 500)

  const handleCreateEntryModalOpen = useCallback(
    (targetEntry: string) => {
      open(CreateEntryModal, {
        target: [namespace ?? '', subNamespace ?? '', targetEntry ?? '']
      })
    },
    [namespace, subNamespace]
  )

  useEffect(() => {
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
        {namespace && subNamespace && (
          <div className="flex items-center gap-2">
            <Button
              icon="tabler:plus"
              tProps={{
                item: t('items.entry')
              }}
              onClick={() => {
                handleCreateEntryModalOpen('')
              }}
            >
              new
            </Button>
          </div>
        )}
      </header>
      <NamespaceSelector />
      {namespace && subNamespace ? (
        <div className="mt-3 flex h-full flex-1 flex-col space-y-6">
          <SearchInput
            namespace="utils.localeAdmin"
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            stuffToSearch="entry"
          />
          <QueryWrapper query={localesQuery}>
            {locales => (
              <LocaleEditor
                locales={locales}
                searchQuery={debouncedSearchQuery}
              />
            )}
          </QueryWrapper>
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
