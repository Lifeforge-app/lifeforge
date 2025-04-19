import { useCallback, useMemo } from 'react'
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

  const hamburgerMenuItems = useMemo(
    () =>
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
      ),
    [
      item,
      setDeleteConfirmationModalOpen,
      setModifyModalOpenType,
      setSelectedData
    ]
  )

  const handleClick = useCallback(() => {
    setSearchParams({
      ...Object.fromEntries(searchParams.entries()),
      category: item.id
    })
  }, [item.id, searchParams])

  const handleCancelButtonClick = useCallback(() => {
    searchParams.delete('category')
    setSearchParams(searchParams)
  }, [searchParams])

  return (
    <SidebarItem
      active={searchParams.get('category') === item.id}
      hamburgerMenuItems={hamburgerMenuItems}
      icon={item.icon}
      name={item.name}
      number={item.amount}
      sideStripColor={item.color}
      onCancelButtonClick={handleCancelButtonClick}
      onClick={handleClick}
    />
  )
}

export default CategoryListItem
