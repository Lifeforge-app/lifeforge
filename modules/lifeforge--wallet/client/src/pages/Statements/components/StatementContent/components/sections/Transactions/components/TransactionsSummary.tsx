import { useQuery } from '@tanstack/react-query'

import { Flex, Icon, Text, WithQuery, colorWithOpacity } from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

function TransactionsSummary({ month, year }: { month: number; year: number }) {
  const typesCountQuery = useQuery(
    forgeAPI.analytics.getTypesCount
      .input({ year: year.toString(), month: (month + 1).toString() })
      .queryOptions()
  )

  const ROWS = [
    {
      type: 'income' as const,
      label: 'Income',
      icon: 'tabler:login-2',
      color: 'green-500'
    },
    {
      type: 'expenses' as const,
      label: 'Expenses',
      icon: 'tabler:logout',
      color: 'red-500'
    },
    {
      type: 'transfer' as const,
      label: 'Transfer',
      icon: 'tabler:arrows-exchange',
      color: 'blue-500'
    }
  ] as const

  return (
    <WithQuery query={typesCountQuery}>
      {data => {
        const total =
          (data.income?.transactionCount ?? 0) +
          (data.expenses?.transactionCount ?? 0) +
          (data.transfer?.transactionCount ?? 0)

        return (
          <Flex direction="column" mt="lg" width="100%">
            {ROWS.map((row, index) => (
              <Flex
                key={row.label}
                align="center"
                bg={
                  index % 2 === 1 ? colorWithOpacity('bg-500', '5%') : undefined
                }
                justify="between"
                p="md"
              >
                <Flex align="center" gap="sm">
                  <Icon color={row.color} icon={row.icon} size="1.5rem" />
                  <Text size="xl">{row.label}</Text>
                </Flex>
                <Text size="lg">
                  {data[row.type]?.transactionCount ?? 0} entries
                </Text>
              </Flex>
            ))}
            <Flex
              align="center"
              bg={colorWithOpacity('bg-500', '5%')}
              justify="between"
            >
              <Text p="md" size="xl" weight="semibold">
                Total
              </Text>
              <Text
                p="md"
                size="lg"
                style={{ borderTop: '2px solid', borderBottom: '6px double' }}
                weight="medium"
              >
                {total} entries
              </Text>
            </Flex>
          </Flex>
        )
      }}
    </WithQuery>
  )
}

export default TransactionsSummary
