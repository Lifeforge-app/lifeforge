import clsx from 'clsx'
import _ from 'lodash'
import { Link, useLocation } from 'react-router'

import {
  Bordered,
  Box,
  Scrollbar,
  Stack,
  Text,
  Transition
} from '@lifeforge/ui'

import ROUTES from '../Router'
import { sidebarLink, sidebarLinkActive, sidebarPanel } from './Sidebar.css'

function Sidebar({
  sidebarOpen,
  setSidebarOpen
}: {
  sidebarOpen: boolean
  setSidebarOpen: (value: boolean) => void
}) {
  const location = useLocation()

  return (
    <>
      <Box
        height="100vh"
        left="0"
        position="fixed"
        style={{
          zIndex: sidebarOpen ? 40 : -1,
          backgroundColor: sidebarOpen ? 'rgba(0,0,0,0.2)' : 'transparent',
          backdropFilter: sidebarOpen ? 'blur(2px)' : 'none',
          transition: 'all 150ms ease'
        }}
        top="0"
        width="100%"
        onClick={() => setSidebarOpen(false)}
      />
      <Transition duration="250ms">
        <Box
          as="aside"
          bg={{ base: 'bg-100', dark: 'bg-900' }}
          className={sidebarPanel}
          height="100%"
          left="0"
          minHeight="0"
          position={{ base: 'fixed', xl: 'static' }}
          style={{
            transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)'
          }}
          width={{
            base: '100%',
            sm: '75%',
            md: '50%',
            xl: '20em'
          }}
          zIndex="9999"
        >
          <Scrollbar>
            <Stack gap="lg" p="2xl">
              {ROUTES.map(({ path, children }) => (
                <Box key={path}>
                  <Text size="lg" weight="semibold">
                    {_.startCase(path?.slice(1).replace(/-/g, ' '))}
                  </Text>
                  <Bordered
                    borderColor={{
                      base: 'bg-200',
                      dark: 'bg-800'
                    }}
                    borderSide="left"
                    borderWidth="1.5px"
                    mt="md"
                    position="relative"
                    style={{
                      isolation: 'isolate'
                    }}
                  >
                    {children!.map(({ path: subpath }) => (
                      <Transition key={`${path}-${subpath}`}>
                        <Text
                          as={Link}
                          className={clsx(sidebarLink, {
                            [sidebarLinkActive]:
                              location.pathname === `${path}/${subpath}`
                          })}
                          color={
                            location.pathname === `${path}/${subpath}`
                              ? 'custom-500'
                              : {
                                  base: 'bg-600',
                                  dark: 'bg-400',
                                  hover: 'bg-800',
                                  darkHover: 'bg-100'
                                }
                          }
                          display="block"
                          position="relative"
                          px="md"
                          py="sm"
                          to={`${path}/${subpath}`}
                          weight={
                            location.pathname === `${path}/${subpath}`
                              ? 'semibold'
                              : 'normal'
                          }
                          onClick={() => {
                            document.querySelector('main')?.scrollTo(0, 0)
                            setSidebarOpen(false)
                          }}
                        >
                          {_.startCase(subpath!.replace(/-/g, ' '))}
                        </Text>
                      </Transition>
                    ))}
                  </Bordered>
                </Box>
              ))}
            </Stack>
          </Scrollbar>
        </Box>
      </Transition>
    </>
  )
}

export default Sidebar
