import { useSearchParams } from 'react-router'

import { MenuItem, SidebarItem } from '@lifeforge/ui'

import { type ICalendarCategory } from '../../../../../interfaces/calendar_interfaces'

function CategoryListItem({
  item,
  setSelectedData,
  setModifyModalOpenType,
  setDeleteConfirmationModalOpen
}: {
  item: ICalendarCategory
  setSelectedData?: React.Dispatch<
    React.SetStateAction<ICalendarCategory | null>
  >
  setModifyModalOpenType?: React.Dispatch<
    React.SetStateAction<'create' | 'update' | null>
  >
  setDeleteConfirmationModalOpen?: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const [searchParams, setSearchParams] = useSearchParams()

  return (
    <SidebarItem
      active={searchParams.get('category') === item.id}
      hamburgerMenuItems={
        setSelectedData &&
        setModifyModalOpenType &&
        setDeleteConfirmationModalOpen && (
          <>
            <MenuItem
              icon="tabler:pencil"
              text="Edit"
              onClick={e => {
                e.stopPropagation()
                setSelectedData(item)
                setModifyModalOpenType('update')
              }}
            />
            <MenuItem
              isRed
              icon="tabler:trash"
              text="Delete"
              onClick={e => {
                e.stopPropagation()
                setSelectedData(item)
                setDeleteConfirmationModalOpen(true)
              }}
            />
          </>
        )
      }
      icon={item.icon}
      name={item.name}
      number={item.amount}
      sideStripColor={item.color}
      onCancelButtonClick={() => {
        searchParams.delete('category')
        setSearchParams(searchParams)
      }}
      onClick={() => {
        setSearchParams({
          ...Object.fromEntries(searchParams.entries()),
          category: item.id
        })
      }}
    />
  )
}

export default CategoryListItem
