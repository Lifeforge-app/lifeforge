import { useQuery } from '@tanstack/react-query'
import { useDebounce } from '@uidotdev/usehooks'
import {
  EmptyStateScreen,
  QueryWrapper,
  SSOHeader,
  SearchInput,
  useModalStore
} from 'lifeforge-ui'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import CreateEntryModal from './components/CreateEntryModal'
import LocaleEditor from './components/LocaleEditor'
import NamespaceSelector from './components/NamespaceSelector'
import { useLocaleManager } from './providers/LocaleManagerProvider'
import forgeAPI from './utils/forgeAPI'

function App() {
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
    <div className="flex h-full w-full flex-1 flex-col p-12">
      <SSOHeader
        actionButtonProps={
          namespace && subNamespace
            ? {
                icon: 'tabler:plus',
                tProps: {
                  item: t('items.entry')
                },
                onClick: () => {
                  handleCreateEntryModalOpen('')
                },
                children: 'new'
              }
            : undefined
        }
        icon="mingcute:translate-line"
        link="https://github.com/Lifeforge-app/lifeforge/tree/main/apps/localization-manager"
        namespace="core.localizationManager"
      />
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

export default App
