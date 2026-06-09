import _ from 'lodash'
import { Fragment, useEffect, useMemo, useState } from 'react'

import { useFederation } from '@lifeforge/federation'
import { normalizeSubnamespace, useAuth } from '@lifeforge/shared'
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
import { useLocation } from 'react-router'

function SidebarItems({ query }: { query: string }) {
  const { userData } = useAuth()

  const { modules } = useFederation()

  const location = useLocation()

  const { sidebarExpanded, toggleSidebar } = useMainSidebarState()

  const [resolvedRoutes, setResolvedRoutes] = useState(modules)

  const filteredRoutes = useMemo(
    () =>
      resolvedRoutes.filter(
        e =>
          e.title.toLowerCase().includes(query.toLowerCase()) ||
          e.items.some(
            subItem =>
              subItem.name.toLowerCase().includes(query.toLowerCase()) &&
              !subItem.disabled &&
              !subItem.hidden
          )
      ),
    [query, userData, resolvedRoutes]
  )

  async function resolveRoutes() {
    const updatedRoutes = await Promise.all(
      modules.map(async category => {
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

    setResolvedRoutes(updatedRoutes)
  }

  useEffect(() => {
    resolveRoutes()
  }, [modules])

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
                      const link = subItem.name.startsWith('lifeforge--')
                        ? subItem.name.split('--')[1]
                        : subItem.name

                      return (
                        <MainSidebarItem
                          key={_.kebabCase(subItem.name)}
                          active={location.pathname.startsWith(`/${link}`)}
                          icon={subItem.icon ?? ''}
                          label={normalizeSubnamespace(subItem.name)}
                          link={`/${link}`}
                          sidebarExpanded={sidebarExpanded}
                          subsection={subItem.subsection}
                          toggleSidebar={toggleSidebar}
                        />
                      )
                    })}
                    {index !== modules.length - 1 &&
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
