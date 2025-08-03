import {
  EmptyStateScreen,
  Scrollbar,
  SidebarDivider,
  SidebarItem,
  SidebarTitle
} from 'lifeforge-ui'
import _ from 'lodash'
import { Fragment, useMemo } from 'react'
import { useSidebarState } from 'shared'

import { useAuth } from '../../../providers/AuthProvider'
import ROUTES from '../../Routes'

function SidebarItems({ query }: { query: string }) {
  const { userData } = useAuth()

  const { sidebarExpanded, toggleSidebar } = useSidebarState()

  const filteredRoutes = useMemo(
    () =>
      ROUTES.filter(
        e =>
          e.title.toLowerCase().includes(query.toLowerCase()) ||
          e.items.some(
            subItem =>
              subItem.name.toLowerCase().includes(query.toLowerCase()) &&
              !subItem.forceDisable &&
              !subItem.hidden &&
              (!subItem.togglable ||
                userData?.enabledModules.includes(_.kebabCase(subItem.name)))
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
                    _.kebabCase(subItem.name)
                  ) === true) &&
                !subItem.forceDisable &&
                !subItem.hidden &&
                (item.title.toLowerCase().includes(query.toLowerCase()) ||
                  subItem.name.toLowerCase().includes(query.toLowerCase()))
            )

            return (
              <Fragment key={`section-${item.title || item.items[0].name}`}>
                {item.title !== '' &&
                  filteredModules.length > 0 &&
                  sidebarExpanded && <SidebarTitle label={item.title} />}
                {filteredModules.map(subItem => (
                  <SidebarItem
                    key={_.kebabCase(subItem.name)}
                    autoActive
                    isMainSidebarItem
                    icon={subItem.icon ?? ''}
                    label={subItem.name.replace('-', ' ')}
                    showAIIcon={subItem.hasAI === true}
                    sidebarExpanded={sidebarExpanded}
                    subsection={subItem.subsection}
                    toggleSidebar={toggleSidebar}
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
