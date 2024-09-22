import { Icon } from '@iconify/react'
import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import HamburgerMenu from '@components/ButtonsAndInputs/HamburgerMenu'
import MenuItem from '@components/ButtonsAndInputs/HamburgerMenu/MenuItem'
import { type ITodoPriority } from '@interfaces/todo_list_interfaces'
import { useTodoListContext } from '@providers/TodoListProvider'

function TaskPriorityListItem({
  item,
  setSidebarOpen
}: {
  item: ITodoPriority
  setSidebarOpen: (value: boolean) => void
}): React.ReactElement {
  const {
    setSelectedPriority: setSelectedData,
    setModifyPriorityModalOpenType: setModifyModalOpenType,
    setDeletePriorityConfirmationModalOpen: setDeleteConfirmationModalOpen
  } = useTodoListContext()

  const [searchParams, setSearchParams] = useSearchParams()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <li
      className={`relative flex items-center gap-6 px-4 font-medium transition-all ${
        searchParams.get('priority') === item.id
          ? "text-bg-800 after:absolute after:right-0 after:top-1/2 after:h-8 after:w-1 after:-translate-y-1/2 after:rounded-full after:bg-custom-500 after:content-[''] dark:text-bg-50"
          : 'text-bg-500 dark:text-bg-500'
      }`}
    >
      <div
        tabIndex={0}
        role="button"
        onClick={() => {
          setSearchParams({
            ...Object.fromEntries(searchParams.entries()),
            priority: item.id
          })
          setSidebarOpen(false)
        }}
        className="group flex w-full items-center gap-6 whitespace-nowrap rounded-lg p-4 text-left hover:bg-bg-100 dark:hover:bg-bg-800"
      >
        <span
          className="block h-8 w-1 shrink-0 rounded-full"
          style={{
            backgroundColor: item.color
          }}
        />
        <div className="w-full truncate">{item.name}</div>
        <span className={!isMenuOpen ? 'text-sm group-hover:hidden' : 'hidden'}>
          {item.amount}
        </span>
        {searchParams.get('priority') === item.id ? (
          <button
            onClick={e => {
              e.stopPropagation()
              setSearchParams(searchParams => {
                searchParams.delete('priority')
                return searchParams
              })
              setSidebarOpen(false)
            }}
            className="hidden overscroll-contain group-hover:block"
          >
            <Icon icon="tabler:x" className="size-5" />
          </button>
        ) : (
          <HamburgerMenu
            smallerPadding
            onButtonClick={e => {
              e.stopPropagation()
              setIsMenuOpen(true)
            }}
            className={`relative overscroll-contain ${
              !isMenuOpen ? 'hidden group-hover:block' : ''
            }`}
            onClose={() => {
              setIsMenuOpen(false)
            }}
          >
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
          </HamburgerMenu>
        )}
      </div>
    </li>
  )
}

export default TaskPriorityListItem
