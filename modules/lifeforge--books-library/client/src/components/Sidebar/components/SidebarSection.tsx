import type { UseQueryResult } from '@tanstack/react-query'
import { useCallback } from 'react'

import {
  EmptyStateScreen,
  SidebarTitle,
  WithQuery,
  useModalStore
} from '@lifeforge/ui'

import ModifyModal from '@/components/modals/ModifyModal'

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
  const { open } = useModalStore()

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
            <EmptyStateScreen
              smaller
              icon="tabler:box-off"
              message={{
                id: stuff
              }}
            />
          )
        }
      </WithQuery>
    </>
  )
}

export default SidebarSection
