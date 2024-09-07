import React, { Fragment } from 'react'
import Scrollbar from '@components/Scrollbar'
import _ROUTES from '@constants/routes_config.json'
import { type IRoutes } from '@interfaces/routes_interfaces'
import { useAuthContext } from '@providers/AuthProvider'
import { useGlobalStateContext } from '@providers/GlobalStateProvider'
import { titleToPath } from '@utils/strings'
import SidebarDivider from './SidebarDivider'
import SidebarItem from './SidebarItem'
import SidebarTitle from './SidebarTitle'

const ROUTES = _ROUTES as IRoutes[]

function SidebarItems(): React.ReactElement {
  const { userData } = useAuthContext()
  const { sidebarExpanded } = useGlobalStateContext()

  return (
    <ul className="flex flex-1 flex-col gap-1 overscroll-none pb-6">
      <Scrollbar>
        {ROUTES.map((item, index) => {
          const enabledModules = item.items
            .filter(
              subItem =>
                !subItem.togglable ||
                userData?.enabledModules.includes(titleToPath(subItem.name))
            )
            .filter(subItem => subItem.hidden !== true)

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
                  hasAI={subItem.hasAI}
                  icon={subItem.icon ?? ''}
                  subsection={subItem.subsection}
                  prefix={item.prefix}
                  isMainSidebarItem
                />
              ))}
              {index !== ROUTES.length - 1 && enabledModules.length > 0 && (
                <SidebarDivider />
              )}
            </Fragment>
          )
        })}
      </Scrollbar>
    </ul>
  )
}

export default SidebarItems
