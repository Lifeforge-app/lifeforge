import { useQueryClient } from '@tanstack/react-query'
import { MenuItem } from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback } from 'react'

import ManageCategoriesModal from '../modals/ManageCategoriesModal'

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
      <MenuItem icon="tabler:refresh" text="Refresh" onClick={handleRefresh} />
      <MenuItem
        icon="tabler:apps"
        namespace="apps.wallet"
        text="Manage Categories"
        onClick={handleManageCategories}
      />
    </>
  )
}

export default HeaderMenu
