import React from 'react'
import { useSearchParams } from 'react-router-dom'
import MenuItem from '@components/ButtonsAndInputs/HamburgerMenu/MenuItem'
import { type ICalendarCategory } from '@interfaces/calendar_interfaces'
import SidebarItem from '@components/Sidebar/components/SidebarItem'

function CategoryListItem({
  item,
  setSelectedData,
  setModifyModalOpenType
}: {
  item: ICalendarCategory
  setSelectedData: React.Dispatch<
    React.SetStateAction<ICalendarCategory | null>
  >
  setModifyModalOpenType: React.Dispatch<
    React.SetStateAction<'create' | 'update' | null>
  >
}): React.ReactElement {
  const [searchParams, setSearchParams] = useSearchParams()

  return (
    <SidebarItem
      active={searchParams.get('category') === item.id}
      color={item.color}
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
        setSearchParams(searchParams => {
          searchParams.delete('category')
          return searchParams
        })
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
              // setDeleteConfirmationModalOpen(true)
            }}
            text="Delete"
          />
        </>
      }
    />
  )
}

export default CategoryListItem
