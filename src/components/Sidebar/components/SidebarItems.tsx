import React, { Fragment } from 'react'
import { useAuthContext } from '@providers/AuthProvider'
import { useGlobalStateContext } from '@providers/GlobalStateProvider'
import { titleToPath } from '@utils/strings'
import SidebarDivider from './SidebarDivider'
import SidebarItem from './SidebarItem'
import SidebarTitle from './SidebarTitle'
import { ROUTES } from '../../../constants/routes_config'

function SidebarItems(): React.ReactElement {
  const { userData } = useAuthContext()
  const { sidebarExpanded } = useGlobalStateContext()

  return (
    <ul className="flex flex-col gap-1 overflow-y-scroll overscroll-none pb-6">
      {ROUTES.map((item, index) => {
        const enabledModules = item.items.filter(
          subItem =>
            !subItem.togglable ||
            userData?.enabledModules.includes(titleToPath(subItem.name))
        )

        return (
          <Fragment
            key={`section-${item.title}-${Math.random()
              .toString(36)
              .substring(7)}`}
          >
            {item.title !== '' &&
              enabledModules.length > 0 &&
              sidebarExpanded && <SidebarTitle name={item.title} />}
            {enabledModules.map(subItem => (
              <SidebarItem
                key={titleToPath(subItem.name)}
                name={subItem.name}
                icon={subItem.icon ?? ''}
                subsection={subItem.subsection}
                isMainSidebarItem
              />
            ))}
            {index !== ROUTES.length - 1 && enabledModules.length > 0 && (
              <SidebarDivider />
            )}
          </Fragment>
        )
      })}
    </ul>
  )
}

export default SidebarItems
