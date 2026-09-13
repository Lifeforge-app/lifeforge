import { useQuery } from '@tanstack/react-query'

import { Flex, Icon, Text } from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import type { PasswordEntry } from '../../..'

function PasswordInfo({ password }: { password: PasswordEntry }) {
  const categoriesQuery = useQuery(forgeAPI.categories.list.queryOptions())

  const categoryData = (categoriesQuery.data || []).find(
    cat => cat.id === password.category
  )

  return (
    <Flex align="center" flex="1" gap="md" minWidth="0" width="100%">
      {categoryData && (
        <Flex
          centered
          flexShrink="0"
          height="3.6em"
          r="full"
          style={{ backgroundColor: categoryData.color }}
          width="4px"
        />
      )}
      <Flex
        centered
        shadow
        p="md"
        r="md"
        style={{
          backgroundColor: password.color + '50'
        }}
      >
        <Icon
          icon={password.icon}
          size="1.5em"
          style={{ color: password.color }}
        />
      </Flex>
      <Flex direction="column" minWidth="0" width="100%">
        <Flex align="center" gap="sm">
          <Text truncate size="xl" weight="semibold">
            {password.name}
          </Text>
        </Flex>
        <Text truncate color="muted">
          {password.username}
        </Text>
      </Flex>
    </Flex>
  )
}

export default PasswordInfo
