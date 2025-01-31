import React from 'react'
import { useSearchParams } from 'react-router-dom'
import MenuItem from '@components/buttons/HamburgerMenu/components/MenuItem'
import { SidebarItem } from '@components/layouts/sidebar'
import { type ICalendarCategory } from '@interfaces/calendar_interfaces'

function CategoryListItem({
  item,
  setSelectedData,
  setModifyModalOpenType,
  setDeleteConfirmationModalOpen
}: {
  item: ICalendarCategory
  setSelectedData: React.Dispatch<
    React.SetStateAction<ICalendarCategory | null>
  >
  setModifyModalOpenType: React.Dispatch<
    React.SetStateAction<'create' | 'update' | null>
  >
  setDeleteConfirmationModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}): React.ReactElement {
  const [searchParams, setSearchParams] = useSearchParams()

  return (
    <SidebarItem
      active={searchParams.get('category') === item.id}
      sideStripColor={item.color}
      icon={item.icon}
      name={item.name}
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
            icon="tabler:pencil"
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
