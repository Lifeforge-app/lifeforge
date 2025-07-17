import { useQueryClient } from '@tanstack/react-query'
import React, { useCallback } from 'react'

import { HamburgerMenuSelectorWrapper, MenuItem } from '@lifeforge/ui'
import { useModalStore } from '@lifeforge/ui'

import ManageCategoriesModal from '../modals/ManageCategoriesModal'
import ColumnVisibilityToggle from '../views/TableView/components/ColumnVisibilityToggle'

function HeaderMenu({
  setView,
  view,
  visibleColumn,
  setVisibleColumn
}: {
  setView: React.Dispatch<React.SetStateAction<'list' | 'table'>>
  view: 'list' | 'table'
  visibleColumn: string[]
  setVisibleColumn: React.Dispatch<React.SetStateAction<string[]>>
}) {
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

  const handleViewChange = useCallback(
    (type: 'list' | 'table') => {
      setView(type)
    },
    [setView]
  )

  return (
    <>
      <MenuItem icon="tabler:refresh" text="Refresh" onClick={handleRefresh} />
      <MenuItem
        icon="tabler:apps"
        namespace="apps.wallet"
        text="Manage Categories"
        onClick={handleManageCategories}
      />
      <div className="block md:hidden">
        <HamburgerMenuSelectorWrapper icon="tabler:eye" title="View as">
          {(['list', 'table'] as const).map(type => (
            <MenuItem
              key={type}
              icon={type === 'list' ? 'uil:apps' : 'uil:list-ul'}
              isToggled={view === type}
              text={type.charAt(0).toUpperCase() + type.slice(1)}
              onClick={e => {
                e.preventDefault()
                handleViewChange(type)
              }}
            />
          ))}
        </HamburgerMenuSelectorWrapper>
      </div>
      {view === 'table' && (
        <ColumnVisibilityToggle
          setVisibleColumn={setVisibleColumn}
          visibleColumn={visibleColumn}
        />
      )}
    </>
  )
}

export default HeaderMenu
