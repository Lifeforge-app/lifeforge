import { useQueryClient } from '@tanstack/react-query'
import { ContextMenuItem } from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback } from 'react'

import ManageCategoriesModal from '../modals/ManageCategoriesModal'
import ManageTemplatesModal from '../modals/ManageTemplatesModal'

function HeaderMenu() {
  const open = useModalStore(state => state.open)

  const queryClient = useQueryClient()

  const handleRefresh = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: ['wallet', 'transactions']
    })
  }, [queryClient])

  const handleManageCategories = useCallback(() => {
    open(ManageCategoriesModal, {})
  }, [])

  return (
    <>
      <ContextMenuItem
        icon="tabler:refresh"
        text="Refresh"
        onClick={handleRefresh}
      />
      <ContextMenuItem
        icon="tabler:apps"
        namespace="apps.wallet"
        text="Manage Categories"
        onClick={handleManageCategories}
      />
      <ContextMenuItem
        icon="tabler:template"
        namespace="apps.wallet"
        text="Manage Templates"
        onClick={() => {
          open(ManageTemplatesModal, {})
        }}
      />
    </>
  )
}

export default HeaderMenu
