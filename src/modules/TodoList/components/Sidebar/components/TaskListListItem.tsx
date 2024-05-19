import { Icon } from '@iconify/react'
import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTodoListContext } from '@providers/TodoListProvider'
import { type ITodoListList } from '@typedec/TodoList'
import HamburgerMenu from '../../../../../components/ButtonsAndInputs/HamburgerMenu'
import MenuItem from '../../../../../components/ButtonsAndInputs/HamburgerMenu/MenuItem'

function TaskListListItem({
  item,
  setSidebarOpen
}: {
  item: ITodoListList
  setSidebarOpen: (value: boolean) => void
}): React.ReactElement {
  const {
    setSelectedList: setSelectedData,
    setModifyListModalOpenType: setModifyModalOpenType,
    setDeleteListConfirmationModalOpen: setDeleteConfirmationModalOpen
  } = useTodoListContext()

  const [searchParams, setSearchParams] = useSearchParams()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <li
      className={`relative flex items-center gap-6 px-4 font-medium transition-all ${
        searchParams.get('list') === item.id
          ? "text-bg-800 after:absolute after:right-0 after:top-1/2 after:h-8 after:w-1 after:-translate-y-1/2 after:rounded-full after:bg-custom-500 after:content-[''] dark:text-bg-100"
          : 'text-bg-500 dark:text-bg-500'
      }`}
    >
      <div
        tabIndex={0}
        role="button"
        onClick={() => {
          setSearchParams({
            ...Object.fromEntries(searchParams.entries()),
            list: item.id
          })
          setSidebarOpen(false)
        }}
        className="group flex w-full items-center gap-6 whitespace-nowrap rounded-lg p-4 text-left hover:bg-bg-200/50 dark:hover:bg-bg-800"
      >
        <span
          className="block h-8 w-1.5 shrink-0 rounded-full"
          style={{
            backgroundColor: item.color
          }}
        />
        <Icon icon={item.icon} className="h-6 w-6 shrink-0" />
        <div className="w-full truncate">{item.name}</div>
        <span className={!isMenuOpen ? 'text-sm group-hover:hidden' : 'hidden'}>
          {item.amount}
        </span>
        {searchParams.get('list') === item.id ? (
          <button
            onClick={e => {
              e.stopPropagation()
              setSearchParams(searchParams => {
                searchParams.delete('list')
                return searchParams
              })
              setSidebarOpen(false)
            }}
            className="hidden overscroll-contain group-hover:block"
          >
            <Icon icon="tabler:x" className="h-5 w-5" />
          </button>
        ) : (
          <HamburgerMenu
            smallerPadding
            onButtonClick={e => {
              e.stopPropagation()
              setIsMenuOpen(true)
            }}
            className={`relative overscroll-contain ${
              !isMenuOpen && 'hidden group-hover:block'
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

export default TaskListListItem
