import _ from 'lodash'
import { Fragment, useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router'

import { useAuth } from '@lifeforge/api'
import { useFederation } from '@lifeforge/federation'
import {
  Box,
  EmptyStateScreen,
  Flex,
  MainSidebarItem,
  Scrollbar,
  SidebarDivider,
  useMainSidebarState
} from '@lifeforge/ui'

import MainSidebarTitle from './MainSidebarTitle'

function SidebarItems({ query }: { query: string }) {
  const { userData } = useAuth()
  const { moduleGroups } = useFederation()
  const location = useLocation()
  const { sidebarExpanded, toggleSidebar } = useMainSidebarState()
  const [resolvedModuleGroups, setResolvedModuleGroups] = useState(moduleGroups)

  const filteredRoutes = useMemo(
    () =>
      resolvedModuleGroups.filter(
        e =>
          e.title.toLowerCase().includes(query.toLowerCase()) ||
          e.items.some(
            subItem =>
              subItem.name.toLowerCase().includes(query.toLowerCase()) &&
              !subItem.disabled &&
              !subItem.hidden
          )
      ),
    [query, userData, resolvedModuleGroups]
  )

  async function resolveModuleGroups() {
    const updatedRoutes = await Promise.all(
      moduleGroups.map(async category => {
        const updatedItems = await Promise.all(
          category.items.map(async mod => {
            if (typeof mod.disabled === 'function') {
              const isDisabled = await mod.disabled()

              return { ...mod, disabled: isDisabled }
            }

            return mod
          })
        )

        return { ...category, items: updatedItems }
      })
    )

    setResolvedModuleGroups(updatedRoutes)
  }

  useEffect(() => {
    resolveModuleGroups()
  }, [moduleGroups])

  return (
    <Flex as="ul" direction="column" flex="1" pb="lg">
      <Box asChild flex="1">
        <Scrollbar usePaddingRight={false}>
          <Flex direction="column" flex="1" gap="xs">
            {filteredRoutes.length > 0 ? (
              filteredRoutes.map((item, index) => {
                const filteredModules = item.items.filter(
                  subItem => !subItem.disabled && !subItem.hidden
                )

                return (
                  <Fragment key={`section-${item.title || item.items[0].name}`}>
                    {item.title !== '' &&
                      filteredModules.length > 0 &&
                      sidebarExpanded && (
                        <MainSidebarTitle title={item.title} />
                      )}
                    {filteredModules.map(subItem => {
                      const strippedName = subItem.name.replace(/^@[^/]+\//, '')
                      const link = strippedName.startsWith('lifeforge--')
                        ? strippedName.split('--')[1]
                        : strippedName

                      return (
                        <MainSidebarItem
                          key={_.kebabCase(subItem.name)}
                          active={location.pathname.startsWith(`/${link}`)}
                          icon={subItem.icon ?? ''}
                          label={subItem.name}
                          link={`/${link}`}
                          sidebarExpanded={sidebarExpanded}
                          subsection={subItem.subsection}
                          toggleSidebar={toggleSidebar}
                        />
                      )
                    })}
                    {index !== moduleGroups.length - 1 &&
                      filteredModules.length > 0 && <SidebarDivider />}
                  </Fragment>
                )
              })
            ) : (
              <Box flex="1" p="lg">
                <EmptyStateScreen
                  smaller
                  icon="tabler:search-off"
                  message={{
                    id: 'modules',
                    namespace: 'common.sidebar'
                  }}
                />
              </Box>
            )}
          </Flex>
        </Scrollbar>
      </Box>
    </Flex>
  )
}

export default SidebarItems
