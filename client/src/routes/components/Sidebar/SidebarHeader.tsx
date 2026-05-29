import { useMainSidebarState } from '@lifeforge/shared'
import { Box, Button, Flex, Icon, SearchInput, Text } from '@lifeforge/ui'

function SidebarHeader({
  searchQuery,
  setSearchQuery
}: {
  searchQuery: string
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>
}) {
  const { sidebarExpanded, toggleSidebar } = useMainSidebarState()

  return (
    <>
      <Flex
        align="center"
        flexShrink="0"
        height="6em"
        justify="between"
        overflow={!sidebarExpanded ? 'hidden' : 'auto'}
        px="lg"
      >
        <Flex asChild align="center" flexShrink="0" gap="sm">
          <Text as="h1" size="xl" weight="semibold" whiteSpace="nowrap">
            <Icon color="primary" icon="tabler:hammer" />
            {sidebarExpanded && (
              <Text tracking="wide">
                LifeForge
                <Text color="primary" size="2xl">
                  .
                </Text>
              </Text>
            )}
          </Text>
        </Flex>
        {sidebarExpanded && (
          <Button icon="tabler:menu" variant="plain" onClick={toggleSidebar} />
        )}
      </Flex>
      {sidebarExpanded && (
        <Box px="md">
          <SearchInput
            bg={{
              base: 'bg-50',
              hover: 'bg-100',
              dark: 'bg-800',
              darkHover: 'bg-700'
            }}
            mb="md"
            namespace="common.sidebar"
            searchTarget="module"
            value={searchQuery}
            onChange={setSearchQuery}
          />
        </Box>
      )}
    </>
  )
}

export default SidebarHeader
