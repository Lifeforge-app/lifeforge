/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable multiline-ternary */
import React, { useContext, useEffect, useState } from 'react'
import { GlobalStateContext } from '../../../providers/GlobalStateProvider'
import SidebarItem from './SidebarItem'
import SidebarTitle from './SidebarTitle'
import SidebarDivider from './SidebarDivider'
import SIDEBAR_ITEMS from '../../../constants/sidebar'
import { type INotesWorkspace } from '../../../modules/Notes'
import useFetch from '../../../hooks/useFetch'

function SidebarItems(): React.JSX.Element {
  const { sidebarExpanded } = useContext(GlobalStateContext)
  const [sidebarItems, setSidebarItems] = useState(SIDEBAR_ITEMS)

  const [notesCategories] = useFetch<INotesWorkspace[]>('notes/workspace/list')

  useEffect(() => {
    if (notesCategories !== 'loading' && notesCategories !== 'error') {
      setSidebarItems(
        sidebarItems.map(item => {
          if (item.name === 'Notes') {
            return {
              ...item,
              subsection: notesCategories.map(({ name, icon, id }) => [
                name,
                icon,
                id
              ])
            }
          } else {
            return item
          }
        })
      )
    }
  }, [notesCategories])

  return (
    <ul className="flex flex-col gap-1 overflow-y-hidden overscroll-none pb-6 hover:overflow-y-scroll">
      {sidebarItems.map(({ type, name, icon, subsection }, index) => {
        switch (type) {
          case 'item':
            return (
              <SidebarItem
                key={type + index}
                name={name!}
                icon={icon ?? ''}
                subsection={subsection}
                isMainSidebarItem
              />
            )
          case 'title':
            return sidebarExpanded ? (
              <SidebarTitle key={type + index} name={name!} />
            ) : (
              <></>
            )
          case 'divider':
            return <SidebarDivider key={type + index} />
          default:
            return <></>
        }
      })}
    </ul>
  )
}

export default SidebarItems
