/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable multiline-ternary */
import React, { useContext } from 'react'
import { GlobalStateContext } from '../../../providers/GlobalStateProvider'
import SidebarItem from './SidebarItem'
import SidebarTitle from './SidebarTitle'
import SidebarDivider from './SidebarDivider'
import SIDEBAR_ITEMS from '../../../constants/sidebar'

function SidebarItems(): React.JSX.Element {
  const { sidebarExpanded } = useContext(GlobalStateContext)

  return (
    <ul className="mt-6 flex flex-col gap-1 overflow-y-hidden pb-6 hover:overflow-y-scroll">
      {SIDEBAR_ITEMS.map(({ type, name, icon, subsection }, index) => {
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
