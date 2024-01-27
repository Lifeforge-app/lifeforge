/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable multiline-ternary */
import React, { useContext, useEffect, useState } from 'react'
import { GlobalStateContext } from '../../../providers/GlobalStateProvider'
import SidebarItem from './SidebarItem'
import SidebarTitle from './SidebarTitle'
import SidebarDivider from './SidebarDivider'
import SIDEBAR_ITEMS from '../../../constants/sidebar'
import { toast } from 'react-toastify'
import { type INotesWorkspace } from '../../../modules/Notes'

function SidebarItems(): React.JSX.Element {
  const { sidebarExpanded } = useContext(GlobalStateContext)

  const [sidebarItems, setSidebarItems] = useState(SIDEBAR_ITEMS)

  const [notesCategories, setNotesCategories] = useState<
    INotesWorkspace[] | 'error' | 'loading'
  >('loading')

  function updateNotesCategory(): void {
    setNotesCategories('loading')
    fetch(`${import.meta.env.VITE_API_HOST}/notes/workspace/list`)
      .then(async response => {
        const data = await response.json()
        setNotesCategories(data.data)

        if (response.status !== 200) {
          throw data.message
        }
      })
      .catch(() => {
        setNotesCategories('error')
        toast.error('Failed to fetch data from server.')
      })
  }

  useEffect(() => {
    updateNotesCategory()
  }, [])

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
    <ul className="mt-6 flex flex-col gap-1 overflow-y-hidden pb-6 hover:overflow-y-scroll">
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
