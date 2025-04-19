import { useQueryClient } from '@tanstack/react-query'
import React from 'react'

import { HamburgerMenuSelectorWrapper, MenuItem } from '@lifeforge/ui'

import ColumnVisibilityToggle from '../views/TableView/components/ColumnVisibilityToggle'

function HeaderMenu({
  setManageCategoriesModalOpen,
  setView,
  view,
  visibleColumn,
  setVisibleColumn
}: {
  setManageCategoriesModalOpen: React.Dispatch<
    React.SetStateAction<boolean | 'new'>
  >
  setView: React.Dispatch<React.SetStateAction<'list' | 'table'>>
  view: 'list' | 'table'
  visibleColumn: string[]
  setVisibleColumn: React.Dispatch<React.SetStateAction<string[]>>
}) {
  const queryClient = useQueryClient()

  return (
    <>
      <MenuItem
        icon="tabler:refresh"
        text="Refresh"
        onClick={() => {
          queryClient.invalidateQueries({
            queryKey: ['wallet', 'transactions']
          })
        }}
      />
      <MenuItem
        icon="tabler:apps"
        namespace="apps.wallet"
        text="Manage Categories"
        onClick={() => {
          setManageCategoriesModalOpen(true)
        }}
      />
      <div className="block md:hidden">
        <HamburgerMenuSelectorWrapper icon="tabler:eye" title="View as">
          {['list', 'table'].map(type => (
            <MenuItem
              key={type}
              icon={type === 'list' ? 'uil:apps' : 'uil:list-ul'}
              isToggled={view === type}
              text={type.charAt(0).toUpperCase() + type.slice(1)}
              onClick={() => {
                setView(type as 'list' | 'table')
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
