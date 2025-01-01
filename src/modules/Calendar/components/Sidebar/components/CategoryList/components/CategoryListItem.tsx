import React from 'react'
import MenuItem from '@components/ButtonsAndInputs/HamburgerMenu/MenuItem'
import SidebarItem from '@components/Sidebar/components/SidebarItem'
import { type ICalendarCategory } from '@interfaces/calendar_interfaces'

function CategoryListItem({
  item,
  setSelectedData,
  setModifyModalOpenType,
  searchParams,
  setSearchParams,
  setDeleteConfirmationModalOpen
}: {
  item: ICalendarCategory
  setSelectedData: React.Dispatch<
    React.SetStateAction<ICalendarCategory | null>
  >
  setModifyModalOpenType: React.Dispatch<
    React.SetStateAction<'create' | 'update' | null>
  >
  searchParams: URLSearchParams
  setSearchParams: (params: Record<string, string> | URLSearchParams) => void
  setDeleteConfirmationModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}): React.ReactElement {
  return (
    <SidebarItem
      active={searchParams.get('category') === item.id}
      sideStripColor={item.color}
      icon={item.icon}
      name={item.name}
      needTranslate={false}
      number={item.amount}
      onClick={() => {
        setSearchParams({
          ...Object.fromEntries(searchParams.entries()),
          category: item.id
        })
      }}
      onCancelButtonClick={() => {
        searchParams.delete('category')
        setSearchParams(searchParams)
      }}
      hamburgerMenuItems={
        <>
          <MenuItem
            icon="tabler:edit"
            onClick={e => {
              e.stopPropagation()
              setSelectedData(item)
              setModifyModalOpenType('update')
            }}
            text="Edit"
          />
          <MenuItem
            isRed
            icon="tabler:trash"
            onClick={e => {
              e.stopPropagation()
              setSelectedData(item)
              setDeleteConfirmationModalOpen(true)
            }}
            text="Delete"
          />
        </>
      }
    />
  )
}

export default CategoryListItem
