import { Link } from 'react-router'

import {
  Bordered,
  Box,
  Button,
  Flex,
  Icon,
  Text,
  Transition,
  colorWithOpacity,
  usePersonalization
} from '@lifeforge/ui'

import GithubStarCount from './GithubStarCount'

function Header({
  sidebarOpen,
  setSidebarOpen
}: {
  sidebarOpen: boolean
  setSidebarOpen: (value: boolean) => void
}) {
  const { setTheme, derivedTheme } = usePersonalization()

  return (
    <Transition property={['background-color', 'color', 'border-color']}>
      <Bordered
        asChild
        borderColor={{ base: 'bg-200', dark: 'bg-800' }}
        borderSide="bottom"
        borderWidth="1.5px"
      >
        <Flex
          align="center"
          as="header"
          bg={{ base: 'bg-100', dark: 'bg-900' }}
          gap="xl"
          position="sticky"
          px="lg"
          py="sm"
          top="0"
          width="100%"
          zIndex="55"
        >
          <Flex align="center" as={Link} gap="sm" to="/">
            <Icon color="primary" icon="tabler:hammer" size="1.75em" />
            <Text as="h1" size="2xl" weight="semibold">
              <Text display={{ base: 'none', sm: 'inline' }}>
                LifeForge
                <Text color="primary" size="3xl">
                  .
                </Text>
              </Text>
              <Text ml={{ base: 'none', sm: 'sm' }} size="xl" weight="medium">
                Docs
              </Text>
            </Text>
          </Flex>
          <Flex align="center" gap="sm" justify="end" width="100%">
            <Flex
              shadow
              align="center"
              as="search"
              bg={{ base: 'bg-50', dark: colorWithOpacity('bg-800', '50%') }}
              display={{ base: 'none', md: 'flex' }}
              gap="sm"
              mr="sm"
              p="sm"
              pl="md"
              r="lg"
              width={{ base: '20rem', lg: '24rem' }}
            >
              <Flex align="center" gap="sm" width="100%">
                <Icon color="muted" icon="tabler:search" size="1.25rem" />
                <Box
                  as="input"
                  bg="transparent"
                  placeholder="Search documentation..."
                  style={{ outline: 'none', padding: '0.25rem' }}
                  type="text"
                  width="100%"
                />
              </Flex>
              <Flex
                shadow
                align="center"
                bg={{
                  base: colorWithOpacity('bg-200', '50%'),
                  dark: colorWithOpacity('bg-800', '90%')
                }}
                p="xs"
                px="sm"
                r="md"
              >
                <Icon color="muted" icon="tabler:command" size="1rem" />
                <Text color="muted" ml="xs" size="sm">
                  K
                </Text>
              </Flex>
            </Flex>
            <Box
              as="button"
              p="sm"
              onClick={() => {
                localStorage.setItem(
                  'theme',
                  derivedTheme === 'dark' ? 'light' : 'dark'
                )
                setTheme(derivedTheme === 'dark' ? 'light' : 'dark')
              }}
            >
              <Transition property="all">
                <Icon
                  color={{
                    base: 'bg-400',
                    hover: 'bg-800',
                    darkHover: 'bg-100'
                  }}
                  icon={derivedTheme === 'dark' ? 'uil:moon' : 'uil:sun'}
                  size="1.5rem"
                />
              </Transition>
            </Box>
            <GithubStarCount />
            <Button
              display={{ base: 'flex', xl: 'none' }}
              icon="tabler:menu"
              p="sm"
              variant="plain"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            />
          </Flex>
        </Flex>
      </Bordered>
    </Transition>
  )
}

export default Header
