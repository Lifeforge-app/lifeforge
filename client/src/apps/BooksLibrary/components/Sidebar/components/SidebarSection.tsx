import type { UseQueryResult } from '@tanstack/react-query'
import { SidebarTitle, WithQuery } from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import ModifyModal from '@apps/BooksLibrary/modals/ModifyModal'

import SidebarItem from './SidebarItem'

function SidebarSection({
  stuff,
  fallbackIcon,
  hasActionButton = true,
  hasContextMenu = true,
  dataQuery,
  useNamespace = false
}: {
  stuff: 'collections' | 'languages' | 'fileTypes' | 'readStatus'
  fallbackIcon?: string
  hasActionButton?: boolean
  hasContextMenu?: boolean
  dataQuery: UseQueryResult<any[]>
  useNamespace?: boolean
}) {
  const open = useModalStore(state => state.open)

  const { t } = useTranslation('apps.booksLibrary')

  const handleCreateItem = useCallback(() => {
    open(ModifyModal, {
      type: 'create',
      initialData: null,
      stuff: stuff as 'collections' | 'languages'
    })
  }, [stuff])

  return (
    <>
      <SidebarTitle
        label={stuff}
        namespace="apps.booksLibrary"
        {...(hasActionButton
          ? {
              actionButtonIcon: 'tabler:plus',
              actionButtonOnClick: handleCreateItem
            }
          : {})}
      />
      <WithQuery query={dataQuery}>
        {data =>
          data.length > 0 ? (
            <>
              {data.map(item => (
                <SidebarItem
                  key={item.id}
                  fallbackIcon={fallbackIcon}
                  hasContextMenu={hasContextMenu}
                  item={item}
                  stuff={stuff}
                  useNamespace={useNamespace}
                />
              ))}
            </>
          ) : (
            <p className="text-bg-500 text-center">{t(`empty.${stuff}`)}</p>
          )
        }
      </WithQuery>
    </>
  )
}

export default SidebarSection
