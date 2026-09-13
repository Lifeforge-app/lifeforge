import { useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'

import { ContextMenu, ContextMenuItem, useModalStore } from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import ManageCategoriesModal from '../modals/ManageCategoriesModal'
import ManageTemplatesModal from '../modals/ManageTemplatesModal'

function HeaderMenu() {
  const { open } = useModalStore()
  const queryClient = useQueryClient()

  const handleRefresh = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: forgeAPI.transactions.key
    })
  }, [queryClient])

  return (
    <ContextMenu
      componentProps={{
        menu: { minWidth: '16rem' }
      }}
    >
      <ContextMenuItem
        icon="tabler:refresh"
        label="Refresh"
        onClick={handleRefresh}
      />
      <ContextMenuItem
        icon="tabler:apps"
        label="Manage Categories"
        onClick={() => open(ManageCategoriesModal, {})}
      />
      <ContextMenuItem
        icon="tabler:template"
        label="Manage Templates"
        onClick={() => open(ManageTemplatesModal, {})}
      />
    </ContextMenu>
  )
}

export default HeaderMenu
