import { useQuery } from '@tanstack/react-query'
import {
  Button,
  EmptyStateScreen,
  ModuleHeader,
  WithQuery,
  useModalStore
} from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'
import type { InferOutput } from 'shared'

import EntryItem from './components/EntryItem'
import ModifyEntryModal from './components/ModifyEntryModal'
import forgeAPI from './utils/forgeAPI'

export type Entry = InferOutput<typeof forgeAPI.{{camel moduleName.en}}.entries.getById>

function {{pascal moduleName.en}}() {
  const { t } = useTranslation('apps.{{camel moduleName.en}}')

  const open = useModalStore(state => state.open)

  const entriesQuery = useQuery(forgeAPI.{{camel moduleName.en}}.entries.list.queryOptions())

  return (
    <>
      <ModuleHeader
        actionButton={
          <Button
            icon="tabler:plus"
            tProps= {{curlyOpen}}{{curlyOpen}}
              item: t('items.entry')
            {{curlyClose}}{{curlyClose}}  
            onClick={() => {
              open(ModifyEntryModal, {
                openType: 'create'
              })
            }}
          >
            new
          </Button>
        }
      />
      <WithQuery query={entriesQuery}>
        {entries =>
          entries.length === 0 ? (
            <EmptyStateScreen
              icon="tabler:cube-off"
              name="entry"
              namespace="apps.{{camel moduleName.en}}"
            />
          ) : (
            <div className="space-y-3">
              {entries.map(entry => (
                <EntryItem key={entry.id} entry={entry} />
              ))}
            </div>
          )
        }
      </WithQuery>
    </>
  )
}

export default {{pascal moduleName.en}}
