import React, { Fragment, useMemo } from 'react'
import EmptyStateScreen from '@components/screens/EmptyStateScreen'
import Scrollbar from '@components/utilities/Scrollbar'
import { type IRoutes } from '@interfaces/routes_interfaces'
import { useAuthContext } from '@providers/AuthProvider'
import { useGlobalStateContext } from '@providers/GlobalStateProvider'
import { titleToPath } from '@utils/strings'
import SidebarDivider from './SidebarDivider'
import SidebarItem from './SidebarItem'
import SidebarTitle from './SidebarTitle'
import _ROUTES from '../../../core/routes_config.json'

const ROUTES = _ROUTES as IRoutes[]

function SidebarItems({ query }: { query: string }): React.ReactElement {
  const { userData } = useAuthContext()
  const { sidebarExpanded } = useGlobalStateContext()
  const filteredRoutes = useMemo(
    () =>
      ROUTES.filter(
        e =>
          e.title.toLowerCase().includes(query.toLowerCase()) ||
          e.items.some(
            subItem =>
              subItem.name.toLowerCase().includes(query.toLowerCase()) &&
              subItem.hidden !== true &&
              (!subItem.togglable ||
                userData?.enabledModules.includes(titleToPath(subItem.name)))
          )
      ),
    [query, userData]
  )

  return (
    <ul className="flex flex-1 flex-col gap-1 overscroll-none pb-6">
      <Scrollbar>
        {filteredRoutes.length > 0 ? (
          filteredRoutes.map((item, index) => {
            const filteredModules = item.items.filter(
              subItem =>
                (!subItem.togglable ||
                  userData?.enabledModules.includes(
                    titleToPath(subItem.name)
                  ) === true) &&
                subItem.hidden !== true &&
                (item.title.toLowerCase().includes(query.toLowerCase()) ||
                  subItem.name.toLowerCase().includes(query.toLowerCase()))
            )

            return (
              <Fragment key={`section-${item.title}`}>
                {item.title !== '' &&
                  filteredModules.length > 0 &&
                  sidebarExpanded && <SidebarTitle name={item.title} />}
                {filteredModules.map(subItem => (
                  <SidebarItem
                    key={titleToPath(subItem.name)}
                    autoActive
                    isMainSidebarItem
                    icon={subItem.icon ?? ''}
                    name={subItem.name}
                    prefix={item.prefix}
                    showAIIcon={subItem.hasAI === true}
                    subsection={subItem.subsection}
                  />
                ))}
                {index !== ROUTES.length - 1 && filteredModules.length > 0 && (
                  <SidebarDivider />
                )}
              </Fragment>
            )
          })
        ) : (
          <div className="flex flex-1 items-center p-6">
            <EmptyStateScreen
              smaller
              icon="tabler:search-off"
              name="modules"
              namespace="common.sidebar"
            />
          </div>
        )}
      </Scrollbar>
    </ul>
  )
}

export default SidebarItems
